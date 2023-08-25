// 🟠 쿠키없으면 돌려보냄
document.addEventListener('DOMContentLoaded', () => {
  let currentURL = window.location.href;

  let navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (currentURL === link.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const token = getCookie('Authorization');

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'http://localhost:3000';
  }
});

const token = getCookie('Authorization');

// 🟠 쿠키 가져오기 함수
function getCookie(cookieName) {
  let name = cookieName + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

// 🟠 유저 디테일
async function fetchUserDetails() {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

// 🟠 프로필 토글
async function toggleProfile() {
  const userDetailsElem = document.getElementById('userDetails');
  const profileImageElem = document.getElementById('profileImage'); // 이미지 엘리먼트 참조

  if (
    userDetailsElem.style.display === 'none' ||
    !userDetailsElem.style.display
  ) {
    const data = await fetchUserDetails();

    if (data) {
      document.getElementById('nickname').textContent = data.nickname;
      document.getElementById('email').textContent = data.email;
      // 이미지 URL을 가져오는 부분
      if (data.imgUrl) {
        const imageUrlResponse = await fetch(
          `http://localhost:3000/upload/file-url/${data.imgUrl}`,
        );
        if (imageUrlResponse.ok) {
          const imageUrl = await imageUrlResponse.text(); // URL 정보를 가져옵니다.
          profileImageElem.src = imageUrl; // 이미지 설정
        } else {
          profileImageElem.src = '/static/photo/login.jpg'; // 기본 이미지 설정
        }
      } else {
        profileImageElem.src = '/static/photo/login.jpg'; // 기본 이미지 설정
      }

      userDetailsElem.style.display = 'block';
    }
  } else {
    userDetailsElem.style.display = 'none';
  }
}
// 🟠 로그아웃 함수
function logout() {
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }
  deleteCookie('Authorization');
  alert('로그아웃 완료');
  window.location.href = 'http://localhost:3000';
}

// 🟠 유저 정보
async function fetchUserInfo(token) {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    return data.nickname; // 사용자의 닉네임을 반환합니다.
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}

//뒤로가기
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    location.reload();
  }
});
