package qa;
import byte.ByteData;
import qa.Arithmetic;

typedef Answer = {
	question:String,
	answer:String,
	debug:String
}

class Ksi {
	
	var lexer:ArithmeticLexer;
	var parser:ArithmeticParser;
	
	public function new() {
		lexer = new ArithmeticLexer();
		parser = new ArithmeticParser(lexer, ArithmeticLexer.tok);
	}
	
	public function answer(text:String):Answer {
		var bytes = ByteData.ofString(text);
		
		var tokens = "";
		lexer.reset(bytes);
		var tok;
		while ((tok = lexer.token(ArithmeticLexer.tok)) != TEof) tokens += tok+"<br/>";
		
		lexer.reset(bytes);
		
		parser.reset();
		var expr = parser.parse();
		var evalState = new EvalState();
		var answer = ArithmeticEvaluator.eval(expr, evalState);
		return {
			question: ArithmeticPrinter.printTex(expr),
			answer: ""+ArithmeticPrinter.printTex(EConst(answer)),
			debug:
				"<h3>Evaluation steps</h3>" +
				"<div class='steps eval'>" + evalState.steps.map(ArithmeticPrinter.printEvalStep).join("\n") + "</div>" +
				expr+"<br/>" +
				"<div class='tokens'>" + tokens + "</div>" +
				"<h3>Parsing steps</h3>" +
				"<div class='steps parser'>" + parser.steps.join("<br/>") + "</div>"
		};
	}
	
}

