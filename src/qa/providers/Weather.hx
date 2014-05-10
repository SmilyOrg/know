package qa.providers;
import haxe.Http;
import haxe.Json;
import haxe.Timer;
import qa.DateExtra;
import qa.providers.Provider;
import qa.Values;

using StringTools;

class OpenWeatherMapQuery extends Query {
	static var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
	
	var location:String;
	var req:Http;
	
	public function new(location:String) {
		this.location = location;
	}
	override public function run() {
		req = new Http(BASE_URL+location.urlEncode());
		//req = new Http("http://localhost/weather.json");
		req.onData = onData;
		req.onError = onError;
		Timer.delay(request, 500);
		//Timer.delay(request, 0);
	}
	function request() {
		if (req != null) req.request();
	}
	override public function cancel() {
		if (req != null) req.cancel();
		cleanup();
	}
	function onError(error:String) {
		cleanup();
		result = None;
		onResult(this);
	}
	function onData(data:String) {
		cleanup();
		result = getResult(data);
		onResult(this);
	}
	function getResult(data:String) {
		var d = Json.parse(data);
		if (!Reflect.hasField(d, "cod") || d.cod != "200") return None;
		var r = new WeatherReport();
		r.time = d.dt;
		r.coordinates = {
			longitude: d.coord.lon,
			latitude: d.coord.lat
		};
		r.location = {
			country: d.sys.country,
			name: d.name
		};
		r.temperature = d.main.temp;
		r.humidity = d.main.humidity;
		r.pressure = d.main.pressure;
		r.wind = {
			speed: d.wind.speed,
			direction: d.wind.deg
		};
		r.cloudCover = d.clouds.all;
		if (Reflect.hasField(d, "weather")) {
			for (dw in (d.weather:Array<Dynamic>)) {
				r.weather.push({
					id: dw.id,
					name: dw.main,
					description: dw.description
				});
			}
		}
		return Item(r, data);
	}
	function cleanup() {
		if (req == null) return;
		req.onData = null;
		req.onError = null;
		req = null;
	}
}

class OpenWeatherMapProvider implements Provider {

	public function new() {}
	
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getClass(item) != String) return new StaticQuery(None);
		
		var str:String = item;
		
		var prefix = "weather ";
		
		if (!str.startsWith(prefix) || prefix.length+2 > str.length) return new StaticQuery(None);
		
		var location = str.substr(prefix.length);
		
		return new OpenWeatherMapQuery(location);
	}
	
}

class WeatherPrinter {
	/*
	public static function printInfoTag(id:String, name:String, value:String) {
		return '
			<div class="info-tag info-tag-$id">
				<div class="name">$name</div>
				<div class="value">$value</div>
			</div>
		';
	}
	*/
	public static function printReport(r:WeatherReport):String {
		/*
		var printed = Mustache.render('
			<div class="time">{{time}}</div>
			<div class="temperature">{{temperature}}</div>
		', {
			time: DateExtra.colloquialElapsedTime(Date.fromTime(((r.time:UInt):Float)*1000)),
			temperature: ""+(r.temperature:Celsius)
		});
		*/
		
		var printed = "";
		
		printed += ValuePrinter.printValueInfoTag(r.location);
		printed += ValuePrinter.printValueInfoTag(r.temperature);
		for (w in r.weather) {
			printed += ValuePrinter.printValueInfoTag(w);
		}
		printed += ValuePrinter.printValueInfoTag(r.humidity);
		printed += ValuePrinter.printValueInfoTag(r.pressure);
		printed += ValuePrinter.printValueInfoTag(r.cloudCover);
		printed += ValuePrinter.printValueInfoTag(r.wind);
		printed += ValuePrinter.printValueInfoTag(r.time);
		printed += ValuePrinter.printValueInfoTag(r.coordinates);
		
		
		//trace("VALUEPRINTER");
		//trace(ValuePrinter.printValueInfoTag(r.time));
		//trace(ValuePrinter.printValueInfoTag(r.location));
		
		//trace(ValuePrinter.printValueInfoTag("time-measured", r.time));
		
		//printed += printInfoTag("time-measured", "Measurement time", DateExtra.colloquialElapsedTime(Date.fromTime(((r.time:UInt):Float)*1000)));
		//printed += printInfoTag("geo", "Location", '${r.location.name}, ${r.location.country}');
		//printed += printInfoTag("temperature", "Temperature", ""+(r.temperature:Celsius));
		//printed += printInfoTag("humidity-relative", "Relative humidity", ""+r.humidity);
		
		return printed;
	}
}

class WeatherReportDisplayProvider implements Provider {

	public function new() {}
	
	public function reset() {}
	
	public function query(item:Dynamic):Query {
		if (Type.getClass(item) != WeatherReport) return new StaticQuery(None);
		
		var report:WeatherReport = item;
		
		return new StaticQuery(Item(null, WeatherPrinter.printReport(report)));
	}
	
}