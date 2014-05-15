package qa.providers;
import byte.ByteData;
import js.html.Element;
import js.html.IFrameElement;
import qa.algebra.Algebra;
import qa.algebra.Evaluation;
import qa.algebra.Parser;
import qa.providers.Provider;

class AlgebraParserProvider implements Provider {
	
	var lexer:AlgebraLexer;
	var parser:AlgebraParser;
	
	public function new() {
		
		lexer = new AlgebraLexer();
		parser = new AlgebraParser(lexer, AlgebraLexer.tok);
		
	}
	
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getClass(item) != String) return new StaticQuery(None);
		
		var bytes = ByteData.ofString(item);
		
		//var tokens = "";
		//lexer.reset(bytes);
		//var tok;
		//while ((tok = lexer.token(AlgebraLexer.tok)) != TEof) tokens += tok+"<br/>";
		
		lexer.reset(bytes);
		
		parser.reset();
		
		try {
			var expr = parser.parse();
			//return new StaticQuery(Item(expr, new SimpleDisplay(AlgebraPrinter.printTex(expr))));
			return new StaticQuery(Item(expr, new StepDisplay(AlgebraPrinter.printTex(expr), parser.steps)));
		} catch (e:Dynamic) {
			//return new StaticQuery(Error("Algebra parsing error: "+e));
			return new StaticQuery(None);
		}
		
	}
}

class AlgebraEvalProvider implements Provider {
	
	public function new() {
	}
	
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getEnum(item) != MathExpression) return new StaticQuery(None);
		
		var expr:MathExpression = item;
		return new StaticQuery(switch (expr) {
			case EPartial(_), ESymbol(_): None;
			case _:
				var evalState = new EvalState();
				var answer = AlgebraEvaluator.eval(expr, evalState);
				//Item(answer, new SimpleDisplay(AlgebraPrinter.printTex(answer)));
				Item(answer, new StepDisplay(AlgebraPrinter.printTex(answer), evalState.steps.map(AlgebraPrinter.printEvalStep)));
		});
		
	}
}

class MathBoxDisplay extends Display {
	var id:Int;
	var expr:MathExpression;
	public function new(id:Int, expr:MathExpression) {
		this.id = id;
		this.expr = expr;
	}
	override public function apply(element:Element) {
		var frameid = 'mathbox-query-frame-$id';
		//var funcid = 'mathboxQueryFunction$id';
		
		var iframes = element.getElementsByTagName("iframe");
		var frame:IFrameElement;
		if (iframes.length > 0) {
			frame = cast iframes[0];
			callMathBox(frame);
		} else {
			//element.innerHTML = '<div><iframe class="mathbox-frame" frameborder="0" id="$frameid" src="lib/mathbox.html"></iframe><script> var m = document.getElementById("$frameid"); m.onload = function() { this.contentWindow.$call } </script></div>';
			element.innerHTML = '
				<h3 class="provider-name">MathBox</h3>
				<iframe class="mathbox-frame" frameborder="0" id="$frameid" src="lib/mathbox.html"></iframe>
			';
			frame = cast element.getElementsByTagName("iframe")[0];
			frame.contentWindow.addEventListener("mathboxReady", function(e) {
				callMathBox(frame);
			});
		}
	}
	function callMathBox(frame:IFrameElement) {
		var primid = frame.id+"-primitive";
		
		var evalState = new EvalState();
		evalState.evalPartial = true;
		
		var vars = new Array<String>();
		AlgebraEvaluator.accumulateVariables(expr, vars);
		
		var f:Dynamic = null;
		
		switch (vars.length) {
			case 0: throw "Missing variables in partial expression";
			case 1:
				f = function(x:Float) {
					evalState.boundVars[vars[0]] = CReal(x);
					evalState.clearSteps();
					var res = AlgebraEvaluator.eval(expr, evalState);
					switch (res) {
						case ESymbol(SConst(CReal(n))):
							return (n:Float);
						case _:
							return 0;
					}
				};
				untyped frame.contentWindow.showFunction2D(primid, f);
			case 2:
				f = function(x:Float, y:Float) {
					evalState.boundVars[vars[0]] = CReal(x);
					evalState.boundVars[vars[1]] = CReal(y);
					evalState.clearSteps();
					var res = AlgebraEvaluator.eval(expr, evalState);
					switch (res) {
						case ESymbol(SConst(CReal(n))):
							return (n:Float);
						case _:
							return 0;
					}
				}
				untyped frame.contentWindow.showFunction3D(primid, f);
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
	
	public function query(item:Dynamic):Query {
		if (Type.getEnum(item) != MathExpression) return new StaticQuery(None);
		
		var expr:MathExpression = item;
		return new StaticQuery(switch (expr) {
			case EPartial(_):
				var id = queries++;
				
				Item(null, new MathBoxDisplay(id, expr));
				
			case _: None;
		});
		
	}
}
