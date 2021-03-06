package ;

import haxe.unit.TestRunner;
import hxparse.NoMatch;
import jQuery.JQuery;
import jQuery.JQueryHelper.J;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import js.html.Node;
import js.Lib;
import qa.providers.Provider;
import test.TestAlgebra;
import test.TestArithmetic;

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
	var output:JQuery;
	var debug:JQuery;
	var answers:JQuery;
	
	public function new() {
		ksi = new Ksi();
		ksi.onAnswer = onAnswer;
		ksi.onFinish = onFinish;
		
		// TODO sigma.js to display parsed graph, mathbox to show functions, mathjax
		
		input = J("#input");
		input.bind("input", inputChange);
		
		info = J("#info");
		
		output = J("#output");
		debug = J("#debug");
		answers = J("#answers");
		
		output.on("click", ".show", function(e) {
			J(e.target).hide().siblings(".steps, .hide").show();
		});
		output.on("click", ".hide", function(e) {
			J(e.target).hide().siblings(".steps").hide().siblings(".show").show();
		});
		
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
		//input.val("0xA+1+(-2/3)^4/5");
		//input.val("1+0.123");
		//input.val("x+1");
		//input.val("2*3+(x/2+1)*2-4+1");
		//input.val("1*1-1+1");
		//input.val("1+1");
		//input.val("1-2*3+3*2^5*5");
		//input.val("1+2*3^4*5+6");
		//input.val("1+2*3^4*5+1*1-1+1");
		//input.val("1^2*3+4");
		//input.val("x^2");
		//input.val("sin(1)");
		//input.val("sin(x)");
		//input.val("pi");
		//input.val("pi*2");
		//input.val("2*pi");
		input.val("pi*pi");
		//input.val("log(1+x*(e^3-1))/3");
		//input.val("-x^2");
		//input.val("1-2+x^2-3+4");
		//input.val("x^2+y^2");
		//input.val("(3/4)/(5/6)*0.1");
		//input.val("sum = 0; for (x in [1, 2, 3]) sum += x; sum;");
		//input.val("weather ljubljana");
		inputChange();
		
		var runner = new TestRunner();
		runner.add(new TestArithmetic());
		runner.add(new TestAlgebra());
		runner.run();
		var tests = J("#tests");
		tests.text(""+runner.result);
		setColor(tests, runner.result.success ? Theme.disabled : Theme.error);
		//info.text(""+runner.result);
		//setColor(info, runner.result.success ? Theme.disabled : Theme.error);
		
		//untyped __js__("require('nw.gui').Window.get().showDevTools()");
	}
	
	function inputChange(e = null) {
		var question:String = input.val();
		info.text("");
		//setColor(output., Theme.disabled);
		if (question.length == 0) {
			answers.text("");
			return;
		}
		try {
			//output.html("");
			//
			//answers = J(Browser.document.createDivElement());
			//output.append(answers);
			
			answers.children().addClass("outdated");
			ksi.answer(question);
			
			/*
			output.html("");
			for (answer in answers) {
				//var elemQuestion = Browser.document.createDivElement();
				//elemQuestion.innerHTML = answer.question;
				//output.append(elemQuestion);
				
				var elemAnswers = J(Browser.document.createDivElement());
				for (ans in answer.answers) {
					var elemAnswer = Browser.document.createDivElement();
					elemAnswer.innerHTML = ans;
					elemAnswers.append(elemAnswer);
				}
				output.append(elemAnswers);
			}
			setColor(output, Theme.normal);
			
			typeset(output[0]);
			*/
			//typeset(J(".steps .eval")[0]);
			
		//} catch (e:NoMatch<Dynamic>) {
		} catch (e:Dynamic) {
			//var errstr:String = ""+e;
			//errstr.replace("\n", "<br/>");
			info.text("Error: "+e);
		}
	}
	
	function onAnswer(answer:Answer) {
		if (answer.display.provider == null) throw "what" + answer.display;
		var result = getResultElement(answer.display.provider);
		answer.display.apply(result);
		//setColor(J(result), Theme.normal);
		result.dataset.relevance = ""+answer.display.relevance;
		sortAnswers();
		typeset(result);
	}
	
	function sortAnswers() {
		var nodes = answers.children();
		untyped nodes.sort(sortByRelevance);
		for (answer in answers.children()) {
			var element:Element = cast answer;
			untyped element.style.order = -element.dataset.relevance;
		}
		//for (node in nodes) trace((cast(node, Element)).dataset.relevance);
		//nodes.appendTo(answers);
	}
	
	function sortByRelevance(a:Element, b:Element) {
		var ra = Std.parseInt(a.dataset.relevance);
		var rb = Std.parseInt(b.dataset.relevance);
		return ra > rb ? 1 : ra < rb ? -1 : 0;
	}
	
	function onFinish() {
		//answers.children(".outdated").remove();
	}
	
	function getResultElement(provider:Provider):Element {
		var name = Type.getClassName(Type.getClass(provider));
		var id = ~/([a-z])([A-Z])/g.replace(name, "$1-$2").replace(".", "-").toLowerCase();
		var existing = answers.children('.$id.outdated');
		var result:Element;
		if (existing.length > 0) {
			result = cast existing.first().removeClass("outdated")[0];
		} else {
			var element = Browser.document.createDivElement();
			element.classList.add(id);
			result = element;
			answers.append(result);
		}
		return result;
	}
	
	function typeset(element:Element) {
		untyped __js__("MathJax.Hub.Queue(['Typeset',MathJax.Hub,element]);");
	}
	
	function setColor(e:JQuery, color:Int) {
		e.css({ color: "#"+color.hex(6) });
	}
	
}