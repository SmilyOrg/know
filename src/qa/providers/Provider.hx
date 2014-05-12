package qa.providers;
import js.html.Element;

enum Result {
	None;
	Error(msg:String);
	Item(item:Dynamic, display:Display);
}

class Display {
	public var provider:Provider;
	public function apply(element:Element) {};
}

class SimpleDisplay extends Display {
	var printed:String;
	public function new(printed:String) {
		this.printed = printed;
	}
	override public function apply(element:Element) {
		element.innerHTML = "<h3 class='provider-name'>"+Type.getClassName(Type.getClass(provider))+"</h3>"+printed;
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
