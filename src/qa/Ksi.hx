package qa;
import byte.ByteData;
import qa.algebra.Parser;
import qa.algebra.Algebra;
import qa.algebra.Evaluation;

typedef Answer = {
	question:String,
	answer:String,
	debug:String
}

class Ksi {
	
	var lexer:AlgebraLexer;
	var parser:AlgebraParser;
	
	public function new() {
		lexer = new AlgebraLexer();
		parser = new AlgebraParser(lexer, AlgebraLexer.tok);
	}
	
	public function answer(text:String):Answer {
		var bytes = ByteData.ofString(text);
		
		var tokens = "";
		lexer.reset(bytes);
		var tok;
		while ((tok = lexer.token(AlgebraLexer.tok)) != TEof) tokens += tok+"<br/>";
		
		lexer.reset(bytes);
		
		parser.reset();
		var expr = parser.parse();
		var evalState = new EvalState();
		var answer = AlgebraEvaluator.eval(expr, evalState);
		return {
			question: AlgebraPrinter.printTex(expr),
			//answer: ""+AlgebraPrinter.printTex(ESymbol(SConst(answer))),
			answer: ""+AlgebraPrinter.printTex(answer),
			debug:
				"<h3>Evaluation steps</h3>" +
				"<div class='steps eval'>" + evalState.steps.map(AlgebraPrinter.printEvalStep).join("\n") + "</div>" +
				expr+"<br/>" +
				"<div class='tokens'>" + tokens + "</div>" +
				"<h3>Parsing steps</h3>" +
				"<div class='steps parser'>" + parser.steps.join("<br/>") + "</div>"
		};
	}
	
}

