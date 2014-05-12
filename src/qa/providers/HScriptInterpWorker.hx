package qa.providers;
import haxe.Serializer;
import haxe.Unserializer;
import hscript.Expr;
import hscript.Interp;
import js.html.MessageEvent;
import js.html.Worker;
import qa.providers.Provider;

using WorkerScript;

class HScriptInterpWorker extends WorkerScript {
	public static function interpret(expr:Expr) {
		var interp = new Interp();
		var result:Result = try {
			var interpResult = interp.execute(expr);
			Item(interpResult, new SimpleDisplay(""+interpResult));
		} catch (e:hscript.Expr.Error) {
			Error("HScript interpreter error: "+e);
		}
		return result;
	}
	public override function onMessage(e:MessageEvent) {
		var expr:Expr = Unserializer.run(e.data);
		var result:Dynamic = interpret(expr);
		postMessage(Serializer.run(result));
	}
	static function main(){
		new HScriptInterpWorker().export();
	}
}