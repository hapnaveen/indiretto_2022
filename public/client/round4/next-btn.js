const nextSlide = document.getElementById("next-slide");
const nextBtn = document.getElementById("next-btn");

let x = 0;

const showNext = (x, y) => {
	if (x == y || x > y) {
		setTimeout(() => {
			nextBtn.style.top = "85%";
			nextBtn.addEventListener("click", () => {
				window.location.href = "/round4/submission.html";
			});
		}, 2000);
	}
};

nextSlide.addEventListener("click", () => {
	x++;
	console.log("next clicked");
	showNext(x, 1);
});
