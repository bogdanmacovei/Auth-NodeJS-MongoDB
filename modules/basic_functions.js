module.exports.usernameRegex = function (regexObj) {
	if (regexObj.length < 4) {
		return ('Numele de utilizator este prea scurt');
	}
	else if (regexObj.length > 20) {
		return ('Numele de utilizator este prea lung!');
	}
	else if (regexObj.search(/[^a-zA-Z0-9 \_\.]/) != -1) {
		return ('In numele de utilizator puteti folosi litere, cifre si urmatoarele simboluri:\"., _\". ')
	}

	return ('ok');
}

module.exports.passwordRegex = function (password) {
	if (password.length < 6) {
		return ('Parola este prea scurta');
	}
	else if (password.length > 50) {
		return ('Parola este prea lunga');
	}
	else if (password.search(/[^a-zA-Z0-9\!\@\#\$\*\_\+\.]/) != -1) {
    	return("In parola puteti folosi litere, numere si urmatoarele simboluri:\"!, @, #, $, *, ., +, _\". ");
  	}
  	return ('ok');
}

module.exports.teamRegex = function (team) {
	if (team.length < 6) {
		return ('Numele echipei este prea scurt');
	}
	else if (team.length > 20) {
		return ('Numele echipei este prea lung');
	}
	else if (team.search(/[^a-zA-Z0-9\!\@\#\$\*\_\+\.]/) != -1) {
    	return("In parola puteti folosi litere, numere si urmatoarele simboluri:\"!, @, #, $, *, ., +, _\". ");
  	}
  	return ('ok');
}