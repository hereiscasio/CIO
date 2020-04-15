export const head_to_clock_in_page = function () {
	cy
		.login();
	cy
		.visit('http://localhost:8080/');
};