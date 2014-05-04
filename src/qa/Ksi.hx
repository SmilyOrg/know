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
		var answer = ArithmeticEvaluator.eval(expr);
		return {
			question: ArithmeticPrinter.printTex(expr),
			answer: ""+ArithmeticPrinter.printTex(EConst(answer)),
			debug:
				expr+"<br/>" +
				"<div class='tokens'>" + tokens + "</div>" +
				"<div class='steps'>"+parser.steps.join("<br/>")+"</div>"
		};
	}
	
}

