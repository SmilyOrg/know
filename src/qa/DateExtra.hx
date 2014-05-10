package qa;

class DateExtra {
	public static function colloquialElapsedTime(date:Date):String {
		var now = Date.now();
		var t = now.getTime()-date.getTime();
		
		var sec = t/1000;
		if (sec < 50)  return "moments ago";
		
		var min = sec/60;
		if (min < 1.1) return "a minute ago";
		if (min < 2.1) return "two minutes ago";
		if (min < 5)   return "a few minutes ago";
		if (min < 55)  return Math.round(min)+" minutes ago";
		
		var hrs = min/60;
		if (hrs < 1.1) return "an hour ago";
		if (hrs < 1.5) return "over an hour ago";
		if (hrs < 5.5)  return Math.round(hrs)+" hours ago";
		
		var dys = hrs/24;
		if (dys < 1) {
			if (now.getDate() == date.getDate()) return "today";
			return "yesterday";
		}
		if (dys < 1.7) return "over a day ago";
		if (dys < 6.5) return Math.round(dys-0.2)+" days ago";
		
		var wks = dys/7;
		if (wks < 1.1) return "a week ago";
		if (wks < 1.5) return "over a week ago";
		if (wks < 1.8) return "almost two weeks ago";
		if (wks < 3.8) return Math.round(wks-0.3)+" weeks ago";
		
		return readableDate(date);
	}
	public static function readableDate(date:Date) {
		var day = date.getDate();
		var tens = Math.floor((day%100)/10);
		var units = day%10;
		var suffix =
			tens == 1 ? "th" :
			units == 1 ? "st" :
			units == 2 ? "nd" :
			units == 3 ? "rd" : "th";
		var months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];
		return day+suffix+" "+months[date.getMonth()]+" "+date.getFullYear();
	}
}