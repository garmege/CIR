var intervals = []; // 사용자가 추가한 인터벌을 저장할 배열


// 총 인터벌 시간 업데이트 함수
function updateTotalTime() {
    var totalHours = 0;
    var totalMinutes = 0;

    // display:block인 plan 요소들만 선택하여 시간 합산
    var planElements = document.querySelectorAll('.plan_box[style*="display: block"] .plan');
    planElements.forEach(function (planElement) {
        var timeSpan = planElement.querySelector('.time');
        var timeParts = timeSpan.textContent.split(':');
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);

        totalHours += hours;
        totalMinutes += minutes;
    });

    // 분이 60분을 넘을 경우 시간으로 환산
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    // 총 인터벌 시간 텍스트 업데이트
    var totalTimeText = (totalHours < 10 ? '0' + totalHours : totalHours) + ':' + (totalMinutes < 10 ? '0' + totalMinutes : totalMinutes);
    document.getElementById('total_time').textContent = totalTimeText;
}

// 인터벌 배열에 인터벌 추가 함수
function addIntervalToArr(speed, time) {
    intervals.push({ speed: speed, time: time });
}

// 리셋 버튼 클릭 시 실행되는 함수
function resetPlans() {
    var disposablePlan = document.getElementById('disposable_plan');
    var customIntervalBox = document.getElementById('intervals');

    disposablePlan.innerHTML = ''; // 플랜 삭제

    //커스텀 인터벌 박스 보이게 하기
    customIntervalBox.style.display = 'block';

    // 미리 설정된 세팅들을 숨김
    var settingOptions = document.querySelectorAll('.my_setting_wrap li');
    settingOptions.forEach(function (option) {
        option.style.display = 'none';
    });

    // 총 인터벌 시간 00:00으로 변경
    document.getElementById('total_time').textContent = '00:00';

    // 인터벌 배열 초기화
    intervals = [];
}

// 플랜 추가 버튼 클릭 시 실행되는 함수
function addInterval() {
    var speedInput = document.getElementById('speedInterval');
    var timeInput = document.getElementById('timeInterval');
    var disposablePlan = document.getElementById('disposable_plan');

    var speed = speedInput.value;
    var time = timeInput.value;

    // 입력값 유효성 검사
    if (speed === '' || time === '' || parseInt(time) <= 0) {
        alert('올바른 속도와 시간을 입력하세요.');
        return;
    }

    // 시간 포맷 설정
    time = (parseInt(time) < 10 ? '0' + time : time) + ':00';

    // 새로운 플랜 태그 생성
    var newPlan = document.createElement('div');
    newPlan.classList.add('plan');
    newPlan.innerHTML = `<span>${speed}</span> km/h <span class="time">${time}</span>`;
    disposablePlan.appendChild(newPlan);
    disposablePlan.style.display = 'block';

    // 인터벌 배열에 추가
    addIntervalToArr(speed, time);

    // 총 인터벌 시간 업데이트
    updateTotalTime();

    // 입력 필드 초기화
    speedInput.value = '';
    timeInput.value = '';

    console.log('addInterval 함수 호출됨');
}

// 세팅 불러오기 함수
function loadSetting() {
    var selectedSettingId = document.getElementById('my_setting').value;
    var selectedSettingElement = document.getElementById(selectedSettingId);
    var mySettingWrap = document.querySelector('.my_setting_wrap');
    var customIntervalBox = document.getElementById('intervals');

    //커스텀 인터벌 박스 숨김
    customIntervalBox.style.display = 'none';

    // 모든 세팅 숨김
    var settingOptions = document.querySelectorAll('.my_setting_wrap li');
    settingOptions.forEach(function (option) {
        option.style.display = 'none';
    });

    // 선택한 세팅 표시
    mySettingWrap.style.display = 'block';
    selectedSettingElement.style.display = 'block';

    // disposable_plan의 플랜 삭제
    var disposablePlan = document.getElementById('disposable_plan');
    disposablePlan.innerHTML = '';

    // 선택한 세팅의 플랜을 인터벌 배열에 추가
    var plans = selectedSettingElement.querySelectorAll('.plan');
    plans.forEach(function (plan) {
        var speed = plan.querySelector('span:first-child').textContent;
        var time = plan.querySelector('.time').textContent;
        addIntervalToArr(speed, time);
    });

    // 총 인터벌 시간 업데이트
    updateTotalTime();
}

// 인터벌 시작 함수
function startInterval() {
    // display:block인 .plan_box의 자식인 .plan들을 배열에 담음
    var planElements = document.querySelectorAll('.plan_box[style*="display: block"] .plan');
    var planArray = Array.from(planElements);

    // 배열의 첫 번째 plan에 running 클래스를 추가하고 카운트다운 시작
    startCountdown(planArray, 0);
}

// 카운트다운 시작 함수
function startCountdown(plans, index) {
    if (index >= plans.length) {
        // 모든 인터벌이 종료된 경우
        //alert("인터벌이 모두 종료되었습니다.");
        return;
    }

    var currentPlan = plans[index];
    currentPlan.classList.add("running"); // 현재 인터벌에 running 클래스 추가

    var timeSpan = currentPlan.querySelector(".time");
    var time = timeSpan.innerText;
    var [minutes, seconds] = time.split(":").map(Number);

    // currentPlan(running 클래스가 붙여지는 plan)의 위치로 스크롤 이동
    currentPlan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log(currentPlan);

    var timer = setInterval(function () {
        // 시간 감소
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }

        // 시간 업데이트
        timeSpan.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // 현재 인터벌 종료 조건 확인
        if (minutes === 0 && seconds === 0) {
            clearInterval(timer);
            currentPlan.classList.remove("running"); // 현재 인터벌에서 running 클래스 제거
            // 다음 인터벌로 이동
            startCountdown(plans, index + 1);

            
        }
    }
    
    , 1000);
}
