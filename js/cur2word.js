/*
 * cur2word
 * Переводит валюту из цифр в слова,
 * Пример c2w(1000.23); => Одна тысяча рублей двадцать три копейки.
 */
(function(global) {

	var lang  = 'ru',
		currency = '810',
		words = make.words = (('object' == typeof make.words) ? make.words: {}),
		dic = null, curr = null;
	
	function make (number) {
		var str = number ? number.toString().split('.') : ['0', '0'],
			int = parseInt(str[0], 10),
			float = parseInt(str[1] ? str[1].substr(0, 2) : 0, 10);

		dic = words[lang];
		curr = dic.currency[currency];
		return int2word(int) + ' ' + getIntCurrency(int) + ' ' + float2word(float) + ' ' + getFloatCurrency(float);
	};
	
	
	//разрядно делим целое и возвращаем обратный массив
	//9 112 345 => [345, 112, 9]
	function toRevertArray(int) {
		var arr = [], 
			str = int.toString();
		
		function addToRes(str) {
			arr.push(parseInt(str, 10));
		}
		
		while (str.length > 3) {
			addToRes(str.substr(-3, 3));
			str = str.slice(0, -3);
		}
		
		addToRes(str);
		
		return arr;
	}
	
	function getIntCurrency(num) {
		return curr.int[num % 100] || curr.int[num % 10] || curr.int['d'];
	}
	
	function getFloatCurrency(num) {
		return curr.float[num % 100] || curr.float[num % 10] || curr.float['d'];
	}
	
	/*
	 * 6 => шесть
	 */
	function digitInt2word(digit) {
		return dic.digitInt[digit];
	};	
	
	function digitFloat2word(digit) {
		return dic.digitFloat[digit];
	};
	
	/*
	 * 60
	 */
	function numberInt2word(number) {
		var i, j,
			r = dic.number[number];
		
		if (!r) {
			if (number > 9) {
				i = ((number / 10) | 0) * 10;
				j = number % 10;
				r = dic.number[i] + ' ' + digitInt2word(j);
			} else {
				r = digitInt2word(number);
			}
		}
		
		return r;
	}	
	
	/*
	 * 60
	 */
	function numberFloat2word(number) {
		var i, j,
			r = dic.number[number];
		
		if (!r) {
			if (number > 9) {
				i = ((number / 10) | 0) * 10;
				j = number % 10;
				r = dic.number[i] + ' ' + digitFloat2word(j);
			} else {
				r = digitFloat2word(number);
			}
		}
		
		return r;
	}
	
	function hund2word(hund) {
		var h = (hund / 100) | 0,
			n = hund % 100,
			s = [];
		
		if (h) {
			s.push(dic.hund[h]);
		}
		
		if (n) {
			s.push(numberInt2word(n));
		}
		
		return s.join(' ');
	}
	
	function thous2word(thous) {
		var th = dic.thous[thous],
			i, j, x,
			s = [];
		
		if (!th && thous) {
			i = (thous / 100) | 0;
			j = thous % 100;
			
			x = dic.thous[j];
			
			if (x) {
				if (i) {
					s.push(dic.hund[i]);
				}
				s.push(x);
			} else {
				i = ((thous / 10) | 0) * 10;
				j = thous % 10;
				x = dic.thous[j];
				
				if (x) {
					if (j) {
						s.push(hund2word(i));
					}
					s.push(x);
				} else {
					s.push(hund2word(thous));
					s.push(dic.thous['d']);
				}
				
			}
		} else {
			s.push(th);
		}
		
		return s.join(' ');
	}
	
	function million2word(million) {
		var mill = dic.million[million],
			i, j, x,
			s = [];
		
		if (!mill && million) {
			i = (million / 100) | 0;
			j = million % 100;
			
			x = dic.million[j];
			
			if (x) {
				if (i) {
					s.push(dic.hund[i]);
				}
				s.push(x);
			} else {
				i = ((million / 10) | 0) * 10;
				j = million % 10;
				x = dic.million[j];
				
				if (x) {
					if (j) {
						s.push(hund2word(i));
					}
					s.push(x);
				} else {
					s.push(hund2word(million));
					s.push(dic.million['d']);
				}
				
			}
		} else {
			s.push(mill);
		}
		
		return s.join(' ');
	}
	
	//Вызываем соотвествующую функцию для числа в зависимости от разряда
	function callForRaz(r, num) {
		var res;
		
		switch (r) {
			case 0:
				res = hund2word(num);
				break;
			case 1:
				res = thous2word(num);
				break;
			case 2:
				res = million2word(num);
				break;
			default:
				res = '';
		}
		
		return res;
	}
	
	/*
	 * 1000 => одна тысяча рублей
	 */
	function int2word(int) {
		var s = [], buff,
			arr = toRevertArray(int),
			l = arr.length;
			
		if (l === 1 && !arr[0]) {
			s.push(digitInt2word(0));
		} else {
			while (l--) {
				buff = callForRaz(l, arr[l]);
				
				if (buff) {
					s.push(buff);
				}
			}
		}
		
		return s.join(' ');
	};
	
	/*
	 * 98 => девяносто восемь копеек
	 */
	function float2word(float) {
		var s;
			
		if (!float) {
			s = digitFloat2word(0);
		} else {
			s = numberFloat2word(float);
		}
		
		return s;
	};

	global.c2w = make;
})(window);


/*
 * Словари
 */
(function (global) {
	var words = global.c2w.words;
	words['ru'] = {
		'digitInt': {
					0: 'ноль', 
					1: 'один',
					2: 'два',
					3: 'три',
					4: 'четыре',
					5: 'пять',
					6: 'шесть',
					7: 'семь',
					8: 'восемь',
					9: 'девять'
		},
		'digitFloat': {
					0: 'ноль', 
					1: 'одна',
					2: 'две',
					3: 'три',
					4: 'четыре',
					5: 'пять',
					6: 'шесть',
					7: 'семь',
					8: 'восемь',
					9: 'девять'
		},
		'number': {
					11: 'одиннадцать',
					12: 'двенадцать',
					13: 'тринадцать',
					14: 'четырнадцать',
					15: 'пятьнадцать',
					16: 'шестьнадцать',
					17: 'семьнадцать',
					18: 'восемьнадцать',
					19: 'девятьнадцать',
					10: 'десять',
					20: 'двадцать',
					30: 'тридцать',
					40: 'сорок',
					50: 'пятьдесят',
					60: 'шестьдесят',
					70: 'семьдесят',
					80: 'восемьдесят',
					90: 'девяносто'
		},
		'hund': {
					1: 'сто',
					2: 'двести',
					3: 'триста',
					4: 'четыреста',
					5: 'пятьсот',
					6: 'шестьсот',
					7: 'семьсот',
					8: 'восемьсот',
					9: 'девятьсот'
		},
		'thous': {
					'd': 'тысяч',
					1: 'одна тысяча',
					2: 'две тысячи',
					3: 'три тысячи',
					4: 'четыре тысячи',
					11: 'одиннадцать тысяч',
					12: 'двенадцать тысяч',
					13: 'тринадцать тысяч',
					14: 'четырнадцать тысяч'					
		},
		'million': {
					'd': 'миллионов',
					1: 'один миллион',
					2: 'два миллиона',
					3: 'три миллиона',
					4: 'четыре миллиона',
					11: 'одиннадцать миллионов',
					12: 'двенадцать миллионов',
					13: 'тринадцать миллионов',
					14: 'четырнадцать миллионов'
		},
		'currency': {
					'810': {
						'int'   : {
								'd': 'рублей',
								1: 'рубль',
								2: 'рубля',
								3: 'рубля',
								4: 'рубля',
								11: 'рублей',
								12: 'рублей',
								13: 'рублей',
								14: 'рублей'
						}
						, 'float': {
								'd': 'копеек',
								1: 'копейка',
								2: 'копейки',
								3: 'копейки',
								4: 'копейки',
								11: 'копеек',
								12: 'копеек',
								13: 'копеек',
								14: 'копеек'
						}						
					}
		}
	};
})(window)
