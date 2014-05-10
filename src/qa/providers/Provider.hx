package qa.providers;

enum Result {
	None;
	Error(msg:String);
	Item(item:Dynamic, printed:String);
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
