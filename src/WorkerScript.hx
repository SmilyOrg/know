import js.html.MessageEvent;
class WorkerScript {
	public function new(){}
	
	public function onMessage(e:MessageEvent) {}
	
	public inline function postMessage(m:Dynamic) {
		untyped __js__("self.postMessage( m )");
	}
	
	public static function export(script:WorkerScript) {
		untyped __js__("self.onmessage = script.onMessage");
	} 
}