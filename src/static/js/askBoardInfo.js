document.addEventListener('DOMContentLoaded', function () {
  fetchAskePostDetails();
});

// 🟡 문의게시판 상세페이지 렌더링
async function fetchAskePostDetails() {
  try {
    const response = await fetch(`/api/askBoards/${askBoardId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      alert('권한이 없습니다.');
      window.location.href = '/view/askBoard.html';
    }

    const askBoard = await response.json();
    console.log('문의게시판 데이터 테스트', askBoard);

    const defaultImageUrl = 'https://ifh.cc/g/a2Sg64.png';
    const userImage = askBoard.user.imgUrl || defaultImageUrl;

    const boardContainer = document.querySelector('main');
    const askBoardContainer = boardContainer.querySelector('.post-content');
    askBoardContainer.innerHTML = `
                                    <div class="d-flex justify-content-between align-items-center position-relative">
                                    <h3>${askBoard.title}</h3>
                                    <div class="putdelbutton position-absolute end-0" style="top: 100%;"> 
                                      <a href="/view/askEditBoard.html?askEditBoardId=${askBoard.id}" class="btn btn-secondary edit-post">수정</a>
                                      <button class="btn btn-secondary delete-post" onclick="deleteAskPost()">삭제</button>
                                    </div>
                                    <button
                                      class="btn btn-light ms-auto"
                                      style="font-size: 1.5em; padding: 0.5em 1em"
                                      onclick="toggleControlButtons()"
                                    >
                                      ⋮
                                    </button>   
                                  </div>         
                                  <p class="text-muted post-info">
                                  <img src="${userImage}" alt="Author's Image" style="width: 30px; height: 30px; border-radius: 50%;"> 
                                   <span class="author">${askBoard.id}</span> | 날짜: <span class="date">${askBoard.created_at}</span>
                                  </p>
                                  <p>${askBoard.description}</p>
                                  <br/><br/>
                                  <a type="button" class="btn btn-secondary" href="/view/askBoardReply.html?askBoardId=${askBoardId}">답글 달기</a>                                `;
    boardContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

// 🟡 게시글 삭제 함수
async function deleteAskPost() {
  try {
    const response = await fetch(`/api/askboards/${askBoardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the post');
    }

    alert('게시글이 삭제되었습니다.');
    window.location.href = '/view/askBoard.html';
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('Error deleting post:', error);
  }
}
