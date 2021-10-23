## SemiColon Interaction

### 프로젝트 소개

- SemiColon Interaction

  - 스크롤에 따라 반응하는 동적으로 변하는 페이지
  - SemiColon SNS 프로젝트를 소개하는 페이지 !

- Contributor

  - 조단 : 팀장
  - 김종훈
  - 정소윤
  - 정해인

- Tech Stack

  - HTML, CSS, Javascript

- 프로젝트 기능

<details>
<summary>공동작업</summary>

- 전체 섹션을 관리하기 위한 공동작업
- Works:

1. Default CSS 작업

   - 에릭마이어의 Reset.css

2. SceneInfo

   - 섹션별로 인터랙션이 다르기 때문에 각 Scene의 맞는 값을 넣어줘야 한다.
   - SceneInfo라는 배열안의 객체를 넣어 속성을 지정해주는 역할

3. setLayout()

   - 각 섹션의 따른 브라우저의 크기와, 현재 머물러 있는 스크롤값을 구함
   - load된 이후의, 가장 먼저 실행되는 함수이며 SceneInfo의 type에 따라 해주는 기능이 다르다.
   - Canvas를 사용하는 섹션의 각 크기를 맞춰주는 역할

4. scrollAnimation()

   - 스크롤을 했을 때, 애니메이션
   - Scale, Opacity, transform 등 인터랙션의 역할

5. setImage()

   - Canvas를 위해 image 경로와 image 배열안에 이미지를 계속 push 해주는 역할

6. calValue()

   - scrollAnimation과 관계가 깊으며, currentScene에서 스크롤 된 범위를 비율로 구하는 역할
   - 스크롤에 따른 애니메이션 작업들의 start, end 값

7. Loop()

   - show-scene 값을 스크롤 값에 맞춰 변화시켜준다.
   - 스크롤을 내릴 때와, 올릴 때의 스크롤 값을 맞춰 show-Scene 값을 변화시켜준다.

8. window.addEventListener('load'), window.addEventListener('resize'), window.addEventListener('scroll')
   - load, resize, scroll에 따른 이벤트 작업
   - 로드한 이후에, setLayout을 실행시켜주면서 브라우저 창을 처음 켜거나, 창 크기의 변동 등 이벤트 시 resize를 한다.
   - 이후, scroll에 따른 scroll 값을 Loop() 함수로 보내줌

</details>

<details>
<summary>나의 역할</summary>

- Role: 팀원
  - 1번 섹션부터 15번 섹션까지 취합
  - 각 섹션별 이미지 작업과 용량 줄이는 작업
- Works:

1.  7번 섹션부터 12번 섹션까지 (6개의 섹션 작업)

2.  7번 섹션

    - 434장의 이미지를 로드하기 위한 canvas요소의 getContext() 메서드를 이용해서, 렌더링 컨텍스트와 그리기 함수 사용
    - translateY_in, out, opacity_in, out을 사용하여 위치와 투명도 설정

3.  8번 섹션

    - 301장의 이미지를 로드하기 위한 canvas요소의 getContext() 메서드를 이용해서, 렌더링 컨텍스트와 그리기 함수 사용
    - translateY_in, out, opacity_in, out, fontsize_in, out을 사용하여 위치와 투명도, 폰트사이즈 설정

4.  9번 섹션

    - video 재생
    - autoplay muted loop를 이용하여 자동 반복재생 수행

5.  10번 섹션

    - translateY_in, out, opacity_in, out, scale_in, out을 사용하여 위치와 투명도, 이미지 크기 설정

6.  11번 섹션

    - 3장의 이미지 로드
    - translateY_in, out, opacity_in, out을 사용하여 위치와 투명도 설정

7.  12번 섹션

    - 핸드폰과 채팅요소를 위해, 이미지 작업
    - 일정 스크롤에 다다랐을 때, 채팅요소를 위해 translate_in, out
    - 일정 스크롤에 다다랐을 때, 핸드폰 요소를 멈추기 위한 sticky 속성 사용

</details>

## 프로젝트 기능 시연

<details>
<summary>1 - 3번 섹션</summary>

![1-3번 섹션](https://user-images.githubusercontent.com/31474272/138562607-7f644c5f-b3f4-4474-8b58-e4706f0e9e7d.gif)

</details>

<details>
<summary>4 - 6번 섹션</summary>

![4-6번 섹션](https://user-images.githubusercontent.com/31474272/138562629-cab6ade3-190d-41ee-920b-cf124aaa3290.gif)

</details>

<details>
<summary>7 - 9번 섹션</summary>

![7-9번 섹션](https://user-images.githubusercontent.com/31474272/138562637-e2ab027c-8078-4d09-8d92-131032d5f119.gif)

</details>

<details>
<summary>10 - 12번 섹션</summary>

![10-12번 섹션](https://user-images.githubusercontent.com/31474272/138562650-cb06193e-47f9-4e0e-a6c5-f94c864b127a.gif)

</details>

<details>
<summary>13 - 15번 섹션</summary>

![13-15번 섹션](https://user-images.githubusercontent.com/31474272/138562663-88917c2c-d78b-462e-a49a-09dc1b34553d.gif)

</details>
