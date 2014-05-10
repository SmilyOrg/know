package qa;
import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Type.Ref;

using StringTools;

typedef Tag = {
	var id:String;
	var name:String;
	@:optional var printer:String;
}

class ValuePrinter {
	public static var units:Map<String, String> = [
		"qa.Percent" => "%",
		"qa.RelativeHumidity" => "%",
		"qa.HectoPascal" => " hPa"
	];
	public static var valueTags:Map<String, Tag> = [
		"qa.MeasurementTime" => { id: "time-measured", name: "Measured", printer: "printUnixTime" },
		"qa.GeoPosition" => { id: "geo-position", name: "Position", printer: "printPosition" },
		"qa.GeoLocation" => { id: "geo-location", name: "Location", printer: "printLocation" },
		"qa.Temperature" => { id: "temperature", name: "Temperature", printer: "printTemperature" },
		"qa.RelativeHumidity" => { id: "humidity-relative", name: "Relative humidity" },
		"qa.AtmosphericPressure" => { id: "pressure", name: "Pressure" },
		"qa.CloudCover" => { id: "cloud-cover", name: "Cloud cover" },
		"qa.Wind" => { id: "wind", name: "Wind", printer: "printWind" },
		"qa.Weather" => { id: "weather", name: "Weather", printer: "printWeather" }
	];
	public static function printWithUnit(d:Dynamic, unit:String):String {
		return d+unit;
	}
	public static function printPercent(p:Percent):String {
		return ""+p;
	}
	public static function printPressure(p:AtmosphericPressure<HectoPascal>):String {
		return ""+(p:HectoPascal);
	}
	public static function printUnixTime(time:UnixTime):String {
		return DateExtra.colloquialElapsedTime(Date.fromTime(((time:UInt):Float)*1000));
	}
	public static function printLocation(location:GeoLocation):String {
		return '${location.name}, ${location.country}';
	}
	public static function printPosition(position:GeoPosition):String {
		return '
			<dl><dt>Latitude</dt><dd>${position.latitude}</dd></dl>
			<dl><dt>Longitude</dt><dd>${position.longitude}</dd></dl>
		';
	}
	public static function printWind(wind:Wind):String {
		return '
			<dl><dt>Speed</dt><dd>${wind.speed}</dd></dl>
			<dl><dt>Direction</dt><dd>${wind.direction}</dd></dl>
		';
	}
	public static function printWeather(w:Weather):String {
		var iconName = switch (w.id) {
			case 200, 201, 202, 210, 211, 212, 221, 960, 961: "thunderstorm";
			case 230, 231, 232:                               "storm-showers";
			case 300, 301, 302, 310, 311, 312, 313, 314, 321: "sprinkle";
			case 500, 501, 502:                               "rain";
			case 503, 504:                                    "rain-wind";
			case 511:                                         "rain-mix";
			case 520, 521, 522, 531:                          "showers";
			case 600, 601, 602, 620, 621, 622:                "snow";
			case 611, 612, 615, 616:                          "rain-mix";
			case 701, 711, 721, 741:                          "fog";
			case 731, 751, 761, 762:                          "windy";
			case 771, 905, 957, 958, 959:                     "strong-wind";
			case 781, 900, 901, 962:                          "tornado";
			case 800:                                         "day-sunny";
			case 801, 802:                                    "day-cloudy";
			case 803, 804:                                    "cloudy";
			case 903, 904:                                    "thermometer";
			case 906:                                         "hail";
			case 950:                                         "sunset";
			case 951:                                         "down";
			case 952, 953, 954, 955, 956:                     "windy";
			case _: "day-lightning";
		};
		var icon = '<i class="wi-$iconName"></i>';
		return '$icon ${w.name} (${w.description})';
	}
	public static function printTemperature(temp:Temperature<Kelvin>):String {
		return ""+((temp:Kelvin):Celsius);
		//return "lol";
	}
	macro public static function printValueInfoTag(e:Expr):ExprOf<String> {
		var printed = switch Context.typeof(e) {
			case TAbstract(type, [TAbstract(param, _)]):
				getPrintInfoTagCall(e, type.toString(), param.toString());
			case TAbstract(type, _):
				getPrintInfoTagCall(e, type.toString(), type.toString());
			case TType(type, _):
				getPrintInfoTagCall(e, type.toString(), type.toString());
			case _: Context.error("Expression type not supported", Context.currentPos());
		}
		return printed;
	}
	#if macro
	public static function getPrintInfoTagCall(arg:Expr, typeName:String, unitTypeName:String):Expr {
		var tag = valueTags[typeName];
		if (tag == null) {
			Context.error('Missing value tag: $typeName', Context.currentPos());
		}
		var call = if (tag.printer == null) {
			var unit = units[unitTypeName];
			if (unit == null) Context.error('Missing unit for $unitTypeName', Context.currentPos());
			macro ValuePrinter.printWithUnit($arg, $v{unit});
		} else {
			var ce = $i{tag.printer};
			macro ValuePrinter.$ce($arg);
		}
		return macro ValuePrinter.printInfoTag($v{tag.id}, $v{tag.name}, ${call});
	}
	#end
	public static function printInfoTag(id:String, name:String, value:String) {
		return '
			<dl class="info-tag info-tag-$id">
				<dt>$name</dt>
				<dd>$value</dd>
			</dl>
		';
	}
}

typedef GeoPosition = {
	var longitude:Float;
	var latitude:Float;
}

typedef GeoLocation = {
	var country:String;
	var name:String;
}

typedef Wind = {
	var speed:MetersPerSecond;
	var direction:Degree;
}

typedef Value = Float;

abstract MeasurementTime<T>(T) from T to T {}
abstract Temperature<T>(T) from T to T {}
abstract AtmosphericPressure<T>(T) from T to T {}
abstract CloudCover<T>(T) from T to T {}

abstract UnixTime(UInt) from UInt to UInt {}

abstract Percent(Float) from Float to Float {
	public function toString():String {
		return (this:Float)+"%";
	}
}

abstract Degree(Float) from Float to Float {
	public function toString():String {
		return (this:Float)+"°";
	}
}

abstract Kelvin(Float) from Float to Float {}
abstract Celsius(Float) from Float to Float {
	@:from public static function fromKelvin(k:Kelvin):Celsius {
		return (k:Float)-273.15;
	}
	public function toString():String {
		return Math.fround((this:Float)*100)/100+"°C";
	}
}

abstract RelativeHumidity(Percent) from Percent to Percent {
	public function toString():String {
		return (this:Percent).toString();
	}
}

abstract HectoPascal(Float) from Float to Float {}

abstract MetersPerSecond(Float) from Float to Float {
	public function toString():String {
		return (this:Float)+" m/s";
	}
}


typedef Weather = {
	var id:Int;
	var name:String;
	var description:String;
}

@:publicFields
class WeatherReport {
	var time:MeasurementTime<UnixTime>;
	var coordinates:GeoPosition;
	var location:GeoLocation;
	var temperature:Temperature<Kelvin>;
	@:optional var minimumTemperature:Temperature<Kelvin>;
	@:optional var maximumTemperature:Temperature<Kelvin>;
	var humidity:RelativeHumidity;
	var pressure:AtmosphericPressure<HectoPascal>;
	var wind:Wind;
	var cloudCover:CloudCover<Percent>;
	var weather = new Array<Weather>();
	public function new() {}
}
