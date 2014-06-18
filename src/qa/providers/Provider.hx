package qa.providers;
import js.html.Element;
import jQuery.JQuery;
import jQuery.JQueryHelper.J;

enum Result {
	None;
	Error(msg:String);
	Item(item:Dynamic, display:Display);
}

@:enum
abstract Relevance(Int) {
	var Highly = 20;
	var Somewhat = 10;
	var Neutral = 0;
	var Irrelevant = -1;
}

class Display {
	public var provider:Provider;
	public var relevance:Relevance = Neutral;
	public function apply(element:Element) {};
}

class SimpleDisplay extends Display {
	var printed:String;
	public function new(printed:String, relevance = Neutral) {
		this.printed = printed;
		this.relevance = relevance;
	}
	override public function apply(element:Element) {
		element.innerHTML = "<h3 class='provider-name'>"+Type.getClassName(Type.getClass(provider))+"</h3><div class='content'>"+printed+"</div>";
	}
}

class StepDisplay extends SimpleDisplay {
	var steps:Array<String>;
	public function new(printed:String, steps:Array<String>) {
		super(printed);
		this.steps = steps;
	}
	override public function apply(element:Element) {
		J(element).html("
			<h3 class='provider-name'>"+Type.getClassName(Type.getClass(provider))+"</h3>
			<a href='#' class='show'>show steps</a>
			<a href='#' class='hide'>hide steps</a>
			<div class='content'>" + printed + "</div>
			<div class='steps'>" + [for (step in steps) '<div class=\'step\'>$step</div>'].join('\n') + "</div>
		");
	}
}

class Query {
	public var question:Dynamic;
	public var provider:Provider;
	public var result:Result;
	public function run() {}
	public function cancel() {}
	dynamic public function onResult(q:Query) {};
}

class StaticQuery extends Query {
	public function new(result:Result) {
		this.result = result;
	}
	override public function run() {
		onResult(this);
	}
}

interface Provider {
	function reset():Void;
	function query(item:Dynamic):Query;
}
