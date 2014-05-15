package qa.providers.hscript;
import haxe.Serializer;
import haxe.Timer;
import haxe.Unserializer;
import js.html.MessageEvent;
import js.html.Worker;
import qa.providers.Provider;

class HScriptParserProvider implements Provider {
	
	var parser = new hscript.Parser();
	
	public function new() {}
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getClass(item) != String) return new StaticQuery(None);
		
		var str:String = item;
		
		try {
			var ast = parser.parseString(str);
			var printed = new haxe.macro.Printer().printExpr(new hscript.Macro({ file: "<hscript>", min: 0, max: 0 }).convert(ast));
			return new StaticQuery(Item(ast, new SimpleDisplay(printed)));
		} catch (e:hscript.Expr.Error) {
			return new StaticQuery(None);
		}
		
	}
}

class HScriptInterpProvider implements Provider {
	
	var synchronous:Bool;
	public function new(synchronous:Bool) {
		this.synchronous = synchronous;
	}
	
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getEnum(item) != hscript.Expr) return new StaticQuery(None);
		
		var expr:hscript.Expr = item;
		
		if (synchronous) {
			return new StaticQuery(HScriptInterpWorker.interpret(expr));
		} else {
			return new HScriptInterpQuery(expr);
		}
		
		/*
		try {
			var result = interp.execute(ast);
			return new StaticQuery(Item(result, ""+result));
		} catch (e:hscript.Expr.Error) {
			return new StaticQuery(None);
		}
		*/
	}
}

class HScriptInterpQuery extends Query {
	
	static inline var WATCHDOG_DELAY = 1000;
	
	var ast:hscript.Expr;
	var worker:Worker;
	var watchdog:Timer;
	public function new(ast:hscript.Expr) {
		this.ast = ast;
	}
	override public function run() {
		worker = new Worker("HScriptInterpWorker.js");
		worker.addEventListener("message", onMessage);
		worker.postMessage(Serializer.run(ast));
		watchdog = new Timer(WATCHDOG_DELAY);
		watchdog.run = onWatchdog;
	}
	function onMessage(e:MessageEvent):Void {
		result = Unserializer.run(e.data);
		cleanup();
		onResult(this);
	}
	function onWatchdog() {
		cleanup();
		result = Error('Execution time of ${WATCHDOG_DELAY}ms exceeded.');
		onResult(this);
	}
	override public function cancel() {
		cleanup();
	}
	function cleanup() {
		if (watchdog != null) {
			watchdog.stop();
			watchdog = null;
		}
		if (worker != null) {
			worker.removeEventListener("message", onMessage);
			worker.terminate();
			worker = null;
		}
	}
}