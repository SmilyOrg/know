package ;

import haxe.unit.TestRunner;
import hxparse.NoMatch;
import js.html.Element;
import js.JQuery;
import js.JQuery.JQueryHelper.J;
import js.Lib;
import qa.Arithmetic.ArithmeticToken;
import test.Test;

import qa.Ksi;

using StringTools;

class Theme {
	public static var normal = 0x454545;
	public static var disabled = 0xBFBFBF;
	public static var error = 0xBBA927;
}

class Know {
	static function main() {
		new Know();
	}
	
	var ksi:Ksi;
	var input:JQuery;
	var info:JQuery;
	var outputQuestion:JQuery;
	var outputAnswer:JQuery;
	var debug:JQuery;
	
	public function new() {
		ksi = new Ksi();
		
		// TODO sigma.js to display parsed graph, mathbox to show functions, mathjax
		
		input = J("#input");
		input.bind("input", inputChange);
		
		info = J("#info");
		
		outputQuestion = J("#question");
		outputAnswer = J("#answer");
		debug = J("#debug");
		
		//input.val("1/2*3");
		//input.val("1+10");
		//input.val("0xFF");
		//input.val("1/2");
		//input.val("1+1/2");
		//input.val("1/2-1/2");
		//input.val("(3/4)/(5/6)");
		//input.val("-1/2");
		//input.val("-1+1");
		//input.val("(2/3)^4");
		//input.val("0xA+1+(2/3)^4/5");
		input.val("1+0.123");
		inputChange();
		
		var runner = new TestRunner();
		runner.add(new Test());
		runner.run();
		var tests = J("#tests");
		tests.text(""+runner.result);
		setColor(tests, runner.result.success ? Theme.disabled : Theme.error);
		//info.text(""+runner.result);
		//setColor(info, runner.result.success ? Theme.disabled : Theme.error);
		
		//untyped __js__("require('nw.gui').Window.get().showDevTools()");
	}
	
	function inputChange(e:JqEvent = null) {
		var question = input.val();
		info.text("");
		setColor(outputQuestion, Theme.disabled);
		setColor(outputAnswer, Theme.disabled);
		if (question.length == 0) {
			outputQuestion.text("");
			outputAnswer.text("");
			return;
		}
		try {
			var answer = ksi.answer(question);
			outputQuestion.html(answer.question);
			outputAnswer.html(answer.answer);
			debug.html(answer.debug);
			setColor(outputQuestion, Theme.normal);
			setColor(outputAnswer, Theme.normal);
			
			typeset(outputQuestion[0]);
			typeset(outputAnswer[0]);
			typeset(debug[0]);
			
		//} catch (e:NoMatch<Dynamic>) {
		} catch (e:Dynamic) {
			//var errstr:String = ""+e;
			//errstr.replace("\n", "<br/>");
			info.text("Error: "+e);
		}
	}
	
	function typeset(element:Element) {
		untyped __js__("MathJax.Hub.Queue(['Typeset',MathJax.Hub,element]);");
	}
	
	function setColor(e:JQuery, color:Int) {
		e.css({ color: "#"+color.hex(6) });
	}
	
}