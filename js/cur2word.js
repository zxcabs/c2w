/*
 * cur2word
 * Переводит валюту из цифр в слова,
 * Пример c2w(1000.23); => Одна тысяча рублей двадцать три копейки.
 */
(function(global) {
	var make = function (number) {
		var int = parseInt(number, 10)
			, float = int - parseFloat(number);
		dic = words[lang];
		curr = dic.currency[currency];
			;
		return int2word(int) + ' ' + float2word(float);
	};

	var lang  = 'ru'
		, currency = '810'
		, words = make.words = (('object' == typeof make.words)? make.words: {})
		, dic = null, curr = null
		;
	
	//getter/setter
	make.__defineGetter__('currency', function () {
		return cur;
	});
	
	make.__defineSetter__('currency', function (c) {
		if (words[lang].currency[c]) {
			currency = c;
		}
	});
	
	make.__defineGetter__('lang', function () {
		return lang;
	});
	
	make.__defineSetter__('lang', function (l) {
		if (words[l]) {
			lang = l;
		}
	});
	
	/*
	 * 1000 => одна тысяча рублей
	 */
	function int2word(int) {
		return thous2word(int);
	};
	
	/*
	 * 0.98 => девяносто восемь копеек
	 */
	function float2word(float) {
		return '';
	};
	
	/*
	 * 6 => шесть
	 */
	function digit2word(digit) {
		return dic.digit[digit];
	};
	
	/*
	 * 60
	 */
	function number2word(number) {
		var r = dic.number[number];
		if (!r) {
			if (number > 9) {
				var i = parseInt(number / 10, 10) * 10;
				var j = number - i;
				r = dic.number[i] + ' ' + digit2word(j);
			} else {
				r = digit2word(number);
			}
		}
		return r;
	};
	
	function hund2word(hund) {
		var   h = parseInt(hund / 100)
			, n = hund - h * 100;
		
		return ((h != 0)? dic.hund[h]: '') + ((n == 0 && h == 0)? ' ' + number2word(n): '');		
	}
	
	function thous2word(thous) {
		var   t = parseInt(thous / 1000)
			, h = thous - t * 1000
			, th = dic.thous[t]
			;
			
		return ((th)? th: ((t != 0)? hund2word(h) + dic.thous['d']: '')) + ((h == 0 && t == 0)? ' ' + hund2word(h): '');
	}
	
	global.c2w = make;
})(window);


/*
 * Словари
 */
(function (global) {
	var words = global.c2w.words;
	words['ru'] = {
		'digit'   : {
					'0': 'ноль', 
					'1': 'один',
					'2': 'два',
					'3': 'три',
					'4': 'четыре',
					'5': 'пять',
					'6': 'шесть',
					'7': 'семь',
					'8': 'восемь',
					'9': 'девять',
		}
		, 'number': {
					'11': 'одиннадцать',
					'12': 'двенадцать',
					'13': 'тринадцать',
					'14': 'четырнадцать',
					'15': 'пятьнадцать',
					'16': 'шестьнадцать',
					'17': 'семьнадцать',
					'18': 'восемьнадцать',
					'19': 'девятьнадцать',
					'10': 'десять',
					'20': 'двадцать',
					'30': 'тридцать',
					'40': 'сорок',
					'50': 'пятьдесят',
					'60': 'шестьдесят',
					'70': 'семьдесят',
					'80': 'восемьдесят',
					'90': 'девяносто',
		}
		, 'hund'  : {
					'1': 'сто',
					'2': 'двести',
					'3': 'триста',
					'4': 'четыреста',
					'5': 'пятьсот',
					'6': 'шестьсот',
					'7': 'семьсот',
					'8': 'восемьсот',
					'9': 'девятьсот'
		}
		, 'thous'   : {
					'd': ' тысяч',
					'1': 'одна тысяча',
					'2': 'две тысячи',
					'3': 'три тысячи'
		}
		, 'currency': {
					'810': {
						'int'   : {
								'0': 'рублей',
								'1': 'рубль',
								'2': 'рубля',
								'3': 'рубля',
								'4': 'рубля',
								'5': 'рублей',
								'6': 'рублей',
								'7': 'рублей',
								'8': 'рублей',
								'9': 'рублей'
						}
						, 'float': {
								'0': 'копеек',
								'1': 'копейка',
								'2': 'копейки',
								'3': 'копейки',
								'4': 'копейки',
								'5': 'копеек',
								'6': 'копеек',
								'7': 'копеек',
								'8': 'копеек',
								'9': 'копеек'
						}						
					}
		}
	};
})(window)
