document.addEventListener('DOMContentLoaded', () => {
  renderUserDetails();
});

//🟡 유저 상세페이지 렌더링
async function renderUserDetails() {
  const userProfileImage = document.getElementById('mainProfileImage');
  const userNickname = document.getElementById('mainNickname');
  const userEmail = document.getElementById('mainEmail');
  const userPoint = document.getElementById('mainPoint');
  const userStatus = document.getElementById('mainStatus');

  const data = await fetchUserDetails();

  // 이미지 렌더링
  if (data.imgUrl) {
    userProfileImage.src = data.imgUrl;
  } else {
    userProfileImage.src = 'https://ifh.cc/g/YacO4N.png';
  }

  // 닉네임 및 이메일 렌더링
  userNickname.textContent = data.nickname;
  userEmail.textContent = data.email;
  userPoint.textContent = data.point;
  userStatus.textContent = data.status;

  userId = data.id;
  renderUserQuizzes(userId);
}

let currentPage = 1;
let userId;

document.getElementById('prevPage').addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderUserQuizzes(userId, currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', function () {
  // 페이지 증가 후 데이터가 없으면 다시 감소시키는 로직을 추가해야 함.
  // 이 예제에서는 단순 증가만 합니다.
  currentPage++;
  renderUserQuizzes(userId, currentPage);
});

async function fetchUserQuizzes(userId, page = 1) {
  const baseUrl = '/quiz/userQuiz';
  const queryParams = `?page=${page}&userId=${userId}`;

  try {
    const response = await fetch(baseUrl + queryParams);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API 호출 중 오류가 발생했습니다.');
    }
    return data;
  } catch (error) {
    console.error('Error fetching user quizzes:', error.message);
    throw error;
  }
}

async function renderUserQuizzes(userId, page = 1) {
  const quizContainer = document.getElementById('userQuizzes');

  try {
    const response = await fetchUserQuizzes(userId, page);
    const quizzes = response.data;
    const lastPage = response.last_page;

    quizContainer.innerHTML = '';

    quizzes.forEach((quiz) => {
      const quizItem = document.createElement('li');
      quizItem.classList.add('list-group-item');

      quizItem.innerHTML = `
              
              <strong>${quiz.stock.prdt_abrv_name} (${quiz.stockId}) </strong>
              <br>
              <strong>예측:</strong> ${quiz.upANDdown} 
              <strong>결과:</strong> ${
                quiz.correct === null ? '대기중' : quiz.correct
              }
              <span style="float: right;"><strong>${
                quiz.updated_date
              }</strong></span>           
          `;

      quizContainer.appendChild(quizItem);
    });

    // 페이지 번호 업데이트
    document.getElementById('currentPage').textContent = currentPage;

    // 페이지 버튼 활성화/비활성화
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === lastPage;
  } catch (error) {
    console.error('Error rendering user quizzes:', error.message);
  }
}

// 🟡 s3 이미지 생성
async function uploadImageToServer() {
  try {
    const fileInput = document.getElementById('profileImageInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      headers: {
        Authorization: token,
      },
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.url) {
      const imageElement = document.getElementById('mainProfileImage');
      imageElement.src = data.url;
    } else {
      console.error('Upload 실패:');
      alert('업로드 실패!');
    }
  } catch (error) {
    alert('업로드 중 오류 발생: ' + error);
  }
}
