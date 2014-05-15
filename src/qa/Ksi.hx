package qa;
import byte.ByteData;
import qa.algebra.Parser;
import qa.algebra.Algebra;
import qa.algebra.Evaluation;
import qa.providers.hscript.HScript;
import qa.providers.Math;
import qa.providers.Weather;
import qa.providers.Provider;

typedef Answer = {
	question:String,
	display:Display,
	debug:String
}

typedef QueryResult = {
	provider:Provider,
	query:Query
}

class Ksi {
	
	var providers = new List<Provider>();
	var pending = new List<Dynamic>();
	var answerCount:Int;
	var pendingQueries = new Array<Query>();
	
	public function new() {
		providers.add(new HScriptParserProvider());
		providers.add(new HScriptInterpProvider(false));
		providers.add(new AlgebraParserProvider());
		providers.add(new AlgebraEvalProvider());
		providers.add(new MathBoxProvider());
		providers.add(new OpenWeatherMapProvider());
		providers.add(new WeatherReportDisplayProvider());
	}
	
	dynamic public function onAnswer(answer:Answer) {}
	dynamic public function onFinish() {}
	
	public function answer(text:String) {
		
		//var answers = new Array<Answer>();
		
		answerCount = 0;
		
		for (provider in providers) {
			provider.reset();
		}
		
		while (pendingQueries.length > 0) {
			pendingQueries.pop().cancel();
		}
		
		pending.clear();
		pending.add(text);
		
		answerNext();
		
		//for (i in 0...10) {
		//
			//trace("PENDING", pending);
			//var question = pending.pop();
			//var results = query(question);
			////trace("QUESTION", question, "RESULTS", results);
			//if (pending.length == 0 && results.length == 0) break;
			//var resultAnswers = new Array<String>();
			//for (result in results) {
				/*
				switch (result.result) {
					case Item(item, printed):
						pending.add(item);
						resultAnswers.push("<h3 class='provider-name'>"+Type.getClassName(Type.getClass(result.provider))+"</h3>"+printed);
					case _:
				}
				*/
				//result.query.onResult = queryResult;
				//result.query.run();
			//}
			//answers.push({
				//question: ""+question,
				//answers: resultAnswers,
				//debug: "meh",
			//});
		//}
		
		//return answers;
		
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
	
	function answerNext() {
		if (answerCount++ > 10) return;
		var question = pending.pop();
		var queries = query(question);
		//if (pending.length == 0 && results.length == 0) break;
		for (q in queries) {
			pendingQueries.push(q);
			q.onResult = queryResult;
			q.run();
		}
	}
	
	function queryResult(q:Query) {
		pendingQueries.remove(q);
		//trace("Result: "+Type.getClassName(Type.getClass(q.provider))+' ${q.result}');
		switch (q.result) {
			case None:
			case Error(msg):
				//var display = new SimpleDisplay("<h3 class='provider-name'>"+Type.getClassName(Type.getClass(q.provider))+"</h3>"+msg);
				var display = new SimpleDisplay(msg);
				queryResultDisplay(q, display);
			case Item(item, display):
				pending.add(item);
				queryResultDisplay(q, display);
				answerNext();
		}
		if (pendingQueries.length == 0) {
			onFinish();
		}
	}
	
	function queryResultDisplay(q:Query, display:Display) {
		display.provider = q.provider;
		onAnswer({
			question: ""+q.question,
			display: display,
			debug: "meh",
		});
	}
	
	public function query(item:Dynamic):Array<Query> {
		var results = [];
		//trace("Question "+item);
		for (provider in providers) {
			var providerName = Type.getClassName(Type.getClass(provider));
			//trace(providerName);
			/*
			var result = provider.query(item);
			trace(result);
			switch (result) {
				case None:
				case _: results.push({ provider: provider, result: result });
			}
			*/
			var query = provider.query(item);
			query.provider = provider;
			query.question = item;
			results.push(query);
		}
		return results;
	}
	
}

