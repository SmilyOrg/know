package qa;
import byte.ByteData;
import qa.algebra.Parser;
import qa.algebra.Algebra;
import qa.algebra.Evaluation;
import qa.providers.Provider;

typedef Answer = {
	question:String,
	answers:Array<String>,
	debug:String
}

typedef QueryResult = {
	provider:Provider,
	result:Result
}

class Ksi {
	
	var providers = new List<Provider>();
	
	public function new() {
		providers.add(new HScriptParserProvider());
		providers.add(new HScriptInterpProvider());
		providers.add(new AlgebraParserProvider());
		providers.add(new AlgebraEvalProvider());
		providers.add(new MathBoxProvider());
	}
	
	public function answer(text:String):Array<Answer> {
		
		var answers = new Array<Answer>();
		
		var pending = new List<Dynamic>();
		pending.add(text);
		
		for (provider in providers) {
			provider.reset();
		}
		
		for (i in 0...10) {
			trace("PENDING", pending);
			var question = pending.pop();
			var results = query(question);
			//trace("QUESTION", question, "RESULTS", results);
			if (pending.length == 0 && results.length == 0) break;
			var resultAnswers = new Array<String>();
			for (result in results) {
				switch (result.result) {
					case Item(item, printed):
						pending.add(item);
						resultAnswers.push("<h3 class='provider-name'>"+Type.getClassName(Type.getClass(result.provider))+"</h3>"+printed);
					case _:
				}
			}
			answers.push({
				question: ""+question,
				answers: resultAnswers,
				debug: "meh",
			});
		}
		
		return answers;
		
		/*
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
		*/
	}
	
	public function query(item:Dynamic):Array<QueryResult> {
		var results = [];
		trace("Question "+item);
		for (provider in providers) {
			var providerName = Type.getClassName(Type.getClass(provider));
			trace(providerName);
			var result = provider.query(item);
			trace(result);
			switch (result) {
				case None:
				case _: results.push({ provider: provider, result: result });
			}
		}
		return results;
	}
	
}

