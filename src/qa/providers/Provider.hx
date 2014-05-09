package qa.providers;
import byte.ByteData;
import haxe.macro.Expr.Position;
import haxe.macro.Printer;
import hscript.Expr;
import hscript.Interp;
import hscript.Macro;
import hscript.Parser;
import js.Browser;
import qa.algebra.Algebra;
import qa.algebra.Evaluation.AlgebraEvaluator;
import qa.algebra.Evaluation.EvalState;
import qa.algebra.Parser.AlgebraLexer;
import qa.algebra.Parser.AlgebraParser;

enum Result {
	None;
	Item(item:Dynamic, printed:String);
}

interface Provider {
	function reset():Void;
	function query(item:Dynamic):Result;
}

class AlgebraParserProvider implements Provider {
	
	var lexer:AlgebraLexer;
	var parser:AlgebraParser;
	
	public function new() {
		
		lexer = new AlgebraLexer();
		parser = new AlgebraParser(lexer, AlgebraLexer.tok);
		
	}
	
	public function reset() {}
	
	public function query(item:Dynamic):Result {
		if (Type.getClass(item) != String) return None;
		
		var bytes = ByteData.ofString(item);
		
		//var tokens = "";
		//lexer.reset(bytes);
		//var tok;
		//while ((tok = lexer.token(AlgebraLexer.tok)) != TEof) tokens += tok+"<br/>";
		
		lexer.reset(bytes);
		
		parser.reset();
		
		try {
			var expr = parser.parse();
			return Item(expr, AlgebraPrinter.printTex(expr));
		} catch (e:Dynamic) {
			return None;
		}
		
	}
}

class AlgebraEvalProvider implements Provider {
	
	public function new() {
	}
	
	public function reset() {}
	
	public function query(item:Dynamic):Result {
		if (Type.getEnum(item) != MathExpression) return None;
		
		var expr:MathExpression = item;
		return switch (expr) {
			case EPartial(_), ESymbol(_): None;
			case _:
				var evalState = new EvalState();
				var answer = AlgebraEvaluator.eval(expr, evalState);
				Item(answer, AlgebraPrinter.printTex(answer));
		}
		
	}
}

class MathBoxProvider implements Provider {
	
	private var queries:Int;
	
	public function new() {
		reset();
	}
	
	public function reset() {
		queries = 0;
	}
	
	public function query(item:Dynamic):Result {
		if (Type.getEnum(item) != MathExpression) return None;
		
		var expr:MathExpression = item;
		return switch (expr) {
			case EPartial(_):
				var id = queries++;
				
				var frameid = 'mathbox-query-frame-$id';
				var funcid = 'mathboxQueryFunction$id';
				var primid = 'primitive-$id';
				
				var evalState = new EvalState();
				evalState.evalPartial = true;
				
				//evalState.boundVars["x"] = CReal(5);
				//evalState.steps.clear();
				//var res = AlgebraEvaluator.eval(expr, evalState);
				//trace("EVALUATED");
				//trace(res);
				
				var vars = new Array<String>();
				AlgebraEvaluator.accumulateVariables(expr, vars);
				
				var f:Dynamic = null;
				var call = "";
				
				switch (vars.length) {
					case 0: throw "Missing variables in partial expression";
					case 1:
						f = function(x:Float) {
							evalState.boundVars[vars[0]] = CReal(x);
							evalState.steps.clear();
							var res = AlgebraEvaluator.eval(expr, evalState);
							switch (res) {
								case ESymbol(SConst(CReal(n))):
									return (n:Float);
								case _:
									return 0;
							}
						};
						call = 'showFunction2D("$primid", window.$funcid)';
					case 2:
						f = function(x:Float, y:Float) {
							evalState.boundVars[vars[0]] = CReal(x);
							evalState.boundVars[vars[1]] = CReal(y);
							evalState.steps.clear();
							var res = AlgebraEvaluator.eval(expr, evalState);
							switch (res) {
								case ESymbol(SConst(CReal(n))):
									return (n:Float);
								case _:
									return 0;
							}
						}
						call = 'showFunction3D("$primid", window.$funcid)';
				}
				
				untyped window[funcid] = f;
				Item(null, '<div><iframe class="mathbox-frame" frameborder="0" id="$frameid" src="lib/mathbox.html"></iframe><script> var m = document.getElementById("$frameid"); m.onload = function() { this.contentWindow.$call } </script></div>');
			case _: None;
		}
		
	}
}

class HScriptParserProvider implements Provider {
	
	var parser = new hscript.Parser();
	
	public function new() {}
	public function reset() {}
	
	public function query(item:Dynamic):Result {
		if (Type.getClass(item) != String) return None;
		
		var str:String = item;
		
		try {
			var ast = parser.parseString(str);
			return Item(ast, new haxe.macro.Printer().printExpr(new hscript.Macro({ file: "<hscript>", min: 0, max: 0 }).convert(ast)));
		} catch (e:hscript.Expr.Error) {
			return None;
		}
		
	}
}

class HScriptInterpProvider implements Provider {
	
	var interp = new hscript.Interp();
	
	public function new() {
		interp.variables.set("Math", Math);
	}
	public function reset() {}
	
	public function query(item:Dynamic):Result {
		if (Type.getEnum(item) != hscript.Expr) return None;
		
		var ast:hscript.Expr = item;
		
		try {
			var result = interp.execute(ast);
			return Item(result, ""+result);
		} catch (e:hscript.Expr.Error) {
			return None;
		}
		
	}
}