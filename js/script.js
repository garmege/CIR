var intervals = []; // 사용자가 추가한 인터벌을 저장할 배열


// 인터벌 추가 함수
function addInterval() {
    var speedInput = document.getElementById("speedInterval");
    var timeInput = document.getElementById("timeInterval");
    var intervalsContainer = document.getElementById("disposable_plan");
    var speed = speedInput.value;
    var time = timeInput.value;

    // 입력값에 따라 시간 포맷 설정
    if (time >= 1 && time <= 9) {
        time = "0" + time + ":00";
    } else if (time >= 10) {
        time = time + ":00";
    } else {
        alert("올바른 시간을 입력하세요.");
        return;
    }

    if (speed === "" || time === "") {
        alert("속도와 시간을 입력하세요.");
        return;
    }

    var newInterval = document.createElement("div");
    intervalsContainer.style.display = 'block';
    newInterval.classList.add("plan");

    // 추가된 인터벌의 속도와 시간 설정
    newInterval.innerHTML = `
                    <span>${speed}</span> km/h <span class="time">${time}</span>
                `;
    intervalsContainer.appendChild(newInterval);

    // 입력된 인터벌을 배열에 추가
    intervals.push({ speed: speed, time: time });

    //입력 시간 합산
    updateTotalTime();

    // 입력 필드 초기화
    speedInput.value = "";
    timeInput.value = "";
}

// 전체 시간 업데이트 함수
function updateTotalTime() {
    var totalHours = 0;
    var totalMinutes = 0;

    // 모든 .plan .time 요소 선택
    var timeElements = document.querySelectorAll('.plan_box[style*="display: block"] .time');

    // 각 .plan .time 요소에서 시간을 합산
    timeElements.forEach(function (timeElement) {
        var timeParts = timeElement.textContent.split(":");
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);

        totalHours += hours;
        totalMinutes += minutes;
    });

    // 분 단위가 60분을 넘어갈 경우 시간으로 환산
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    // 시간 형식에 맞게 텍스트 설정
    var totalTimeText =
        (totalHours < 10 ? "0" + totalHours : totalHours) +
        ":" +
        (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes);

    // #total_time 요소의 텍스트 업데이트
    document.getElementById("total_time").textContent = totalTimeText;
}
// 시작 버튼 클릭 시
function startInterval() {
    // 인터벌이 추가되지 않은 경우
    if (intervals.length === 0) {
        alert("인터벌을 추가하세요.");
        return;
    }

    // 첫 번째 인터벌 시작
    startNextInterval();
}

// 다음 인터벌 시작 함수
function startNextInterval() {

    // 현재 진행 중인 인터벌에 running 클래스 추가
    var currentIntervalBox = document.querySelector(
        '.plan_box[style*="display: block"]'
    );
    var currentInterval = currentIntervalBox.querySelector(".plan");
    currentInterval.classList.add("running");

    // 현재 인터벌의 시간(분) 가져오기
    var timeSpan = currentInterval.querySelector(".time");
    var time = timeSpan.innerText;
    var [minutes, seconds] = time.split(":").map(Number);

    // 카운트다운 시작
    var timer = setInterval(function () {
        // 시간 감소
        seconds--;
        if (seconds < 0) {
        seconds = 59;
        minutes--;
        }

        // 시간 업데이트
        timeSpan.innerText = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

        // 현재 인터벌 종료 조건 확인
        if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
        currentInterval.classList.remove("running"); // 현재 인터벌에서 running 클래스 제거

        // 다음 인터벌로 인덱스 이동
        var nextIntervalBox = currentIntervalBox.nextElementSibling;
        if (!nextIntervalBox) {
            // 모든 인터벌이 종료되었을 때
            alert("인터벌이 종료되었습니다.");
            return;
        }

        // // 현재 표시되는 인터벌을 숨기고 다음 인터벌을 표시
        // currentIntervalBox.style.display = "none";
        // nextIntervalBox.style.display = "block";

        // 다음 인터벌 시작
        startNextInterval();
        }
    }, 1000);
}

//인터벌 리셋 함수
function resetPlans() {
    var intervalsContainer = document.getElementById("disposable_plan");
    //내가 세팅해놓은 인터벌들 지우기
    intervalsContainer.querySelector('.plan').remove();
    var plans = document.querySelectorAll(".plan_box");
    plans.forEach(function (plan) {
        plan.style.display = "none";
    });

    // #total_time 요소의 텍스트 업데이트
    document.getElementById("total_time").textContent = "00:00";
    
    // 커스텀 세팅할 수 있는 공간 보이게 하기
    document.querySelector('.interval').style.display = 'block';
}
// 세팅 불러오기 함수
function loadSetting() {
    // .interval 요소를 강제로 숨김
    document.querySelector(".interval").style.display = "none";

    var selectedSettingId = document.getElementById("my_setting").value;
    var selectedSettingElement = document.getElementById(selectedSettingId);
    var plans = selectedSettingElement.querySelectorAll(".plan");

    var totalHours = 0;
    var totalMinutes = 0;

    plans.forEach(function (plan) {
        var speed = plan.querySelector("span:first-child").textContent.trim();
        var timeParts = plan.querySelector(".time").textContent.trim().split(":");
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);

        totalHours += hours;
        totalMinutes += minutes;
    });

    // 분 단위가 60분을 넘어갈 경우 시간으로 환산
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    // 시간 형식에 맞게 텍스트 설정
    var totalTimeText =
        (totalHours < 10 ? "0" + totalHours : totalHours) +
        ":" +
        (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes);

    // #total_time 요소의 텍스트 업데이트
    document.getElementById("total_time").textContent = totalTimeText;

    // 선택한 설정에 해당하는 li 요소와 my_setting_wrap 요소의 스타일 변경
    var mySettingWrap = document.querySelector(".my_setting_wrap");
    var selectedLi = document.getElementById(selectedSettingId);

    // 모든 li 요소를 숨김
    var allLis = mySettingWrap.querySelectorAll("li");
    allLis.forEach(function (li) {
        li.style.display = "none";
    });

    // 선택한 설정에 해당하는 li 요소를 보이게 함
    selectedLi.style.display = "block";

    // my_setting_wrap 요소를 보이게 함
    mySettingWrap.style.display = "block";

    // 나머지 코드는 이전과 동일하게 유지
    intervals.push({ speed: speed, time: time });
    updateTotalTime();
}
