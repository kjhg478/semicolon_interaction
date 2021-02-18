(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
	let enterNewScene = false; // 새로운 scene이 시작된 순간 true
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafId;
	let rafState;
	let step = 0;

	const sceneInfo = [
		{
			// 0
			type: 'sticky',
			heightNum: 1, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				headmessage : document.querySelector('#scroll-section-0 .head-message')
			},
			values: {
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				headmessage_fontsize_out : [8,1, {start:0.1, end:0.5}],
				headmessage_opacity_out : [1,0,{start:0.1, end:0.5}]
			}
		},
		{
			// 1
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
				messageA: document.querySelector('#scroll-section-1 .main-message.a'),
				messageB: document.querySelector('#scroll-section-1 .main-message.b'),
				messageC: document.querySelector('#scroll-section-1 .main-message.c'),
				canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 200,
				imageSequence: [0, 199],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
				messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
				messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
				messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
				messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }]
			}
		},
		{
			// 2(food)
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				messageA: document.querySelector('#scroll-section-2 .main-message.a'),
				messageB: document.querySelector('#scroll-section-2 .main-message.b'),
				messageC: document.querySelector('#scroll-section-2 .main-message.c'),
				messageD: document.querySelector('#scroll-section-2 .main-message.d'),
				container: document.querySelector('#scroll-section-2'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/sh-1.jpg',
					'./images/sh-2.jpg',
					'./images/sh-3.jpg',
					'./images/sh-4.jpg'
				],
				images: []
			},
			values: {
				rect1X: [0, 0, { start: 0, end: 0 }],
				rect2X: [0, 0, { start: 0, end: 0 }],
				blendHeight: [0, 0, { start: 0, end: 0 }],
				blendHeight1: [0, 0, { start: 0, end: 0 }],
				blendHeight2: [0, 0, { start: 0, end: 0 }],

				canvas_scale: [0, 0, { start: 0, end: 0 }],
				canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
				canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
				rectStartY: 0,
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],

				messageA_opacity_in: [0, 1, { start: 0, end: 0.06 }],
                messageA_opacity_out: [1, 0, { start: 0.12, end: 0.18 }],
                messageB_opacity_in: [0, 1, { start: 0.24, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.36, end: 0.42 }],
                messageC_opacity_in: [0, 1, { start: 0.48, end: 0.54 }],
                messageC_opacity_out: [1, 0, { start: 0.6, end: 0.66 }],
                messageD_opacity_in: [0, 1, { start: 0.72, end: 0.78 }],
                messageD_opacity_out: [1, 0, { start: 0.78, end: 0.84 }],

			}
		},
		{
			// 3(여행)
			type: 'sticky',
			heightNum: 4, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				messageA: document.querySelector('#scroll-section-3 .main-message.a'),
				messageB: document.querySelector('#scroll-section-3 .main-message.b'),
				canvas: document.querySelector('#video-canvas-3'),
				context: document.querySelector('#video-canvas-3').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 200,
				imageSequence: [0, 199],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.2 }],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.2, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.7 }],
				messageA_translateY_in: [20, 0, { start: 0.2, end: 0.3 }],
				messageB_translateY_in: [20, 0, { start: 0.6, end: 0.7 }],
				messageA_opacity_out: [1, 0, { start: 0.35, end: 0.4 }],
				messageB_opacity_out: [1, 0, { start: 0.75, end: 0.8 }],
				messageA_translateY_out: [0, -20, { start: 0.35, end: 0.4 }],
				messageB_translateY_out: [0, -20, { start: 0.75, end: 0.8 }]
			}
		},
		{
			// 4(글자소개)
			type: 'sticky',
			heightNum: 10, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-4'),
				messageA: document.querySelector('#scroll-section-4 .main-message.a'),
				messageB: document.querySelector('#scroll-section-4 .main-message.b'),
				messageC: document.querySelector('#scroll-section-4 .main-message.c'),
				messageD: document.querySelector('#scroll-section-4 .main-message.d'),

			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				messageB_opacity_in: [0, 1, { start: 0.2, end: 0.3 }],
				messageC_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
				messageD_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				messageA_translateY_in: [20, 0, { start: 0, end: 0.1 }],
				messageB_translateY_in: [20, 0, { start: 0.2, end: 0.3 }],
				messageC_translateY_in: [20, 0, { start: 0.4, end: 0.5 }],
				messageD_translateY_in: [20, 0, { start: 0.6, end: 0.65 }],
				messageA_opacity_out: [1, 0, { start: 0.15, end: 0.2 }],
				messageB_opacity_out: [1, 0, { start: 0.35, end: 0.4 }],
				messageC_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],
				messageD_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.15, end: 0.2 }],
				messageB_translateY_out: [0, -20, { start: 0.35, end: 0.4 }],
				messageC_translateY_out: [0, -20, { start: 0.55, end: 0.6 }],
				messageD_translateY_out: [0, -20, { start: 0.75, end: 0.8 }],
				messageD_fontsize_up: [0.5, 8, { start: 0.6, end: 0.65 }]
			}
		},
		{
			// 5
			type: 'sticky',
			heightNum: 6, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-5'),
				messageA: document.querySelector('#scroll-section-5 .main-message.a'),
				messageB: document.querySelector('#scroll-section-5 .main-message.b'),
				messageC: document.querySelector('#scroll-section-5 .main-message.c'),
				messageD: document.querySelector('#scroll-section-5 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 434,
				imageSequence: [0, 433],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				canvas_opacity_in : [0, 1, { start: 0, end: 0.1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{
			// 6
			type: 'normal',
			// heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-6')
			}
		},
		{
			// 7
			type: 'sticky',
			heightNum: 6,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-7'),
				messageA: document.querySelector('#scroll-section-7 .a'),
				messageB: document.querySelector('#scroll-section-7 .b'),
				messageC: document.querySelector('#scroll-section-7 .c'),
				messageD: document.querySelector('#scroll-section-7 .d'),
				messageE: document.querySelector('#scroll-section-7 .e'),
				canvas: document.querySelector('#video-canvas-7'),
				context: document.querySelector('#video-canvas-7').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 301,
				imageSequence: [0, 300],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.2 }],
				canvas_opacity_out: [1, 0, { start: 0.8, end: 1 }],
				messageA_translateY_in: [80, 0, { start: 0.05, end: 0.1 }],
				messageB_translateY_in: [90, 0, { start: 0.1, end: 0.25 }],
				messageC_translateY_in: [100, 0, { start: 0.25, end: 0.4 }],
				messageD_translateY_in: [110, 0, { start: 0.4, end: 0.55 }],
				messageE_translateY_in: [120, 0, { start: 0.55, end: 0.7 }],
				messageA_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
				messageB_opacity_in: [0, 1, { start: 0.1, end: 0.25 }],
				messageC_opacity_in: [0, 1, { start: 0.25, end: 0.4 }],
				messageD_opacity_in: [0, 1, { start: 0.4, end: 0.55 }],
				messageE_opacity_in: [0, 1, { start: 0.55, end: 0.7 }],
				messageA_fontsize_in: [1, 5, {start : 0.05, end: 0.1}],
				messageB_fontsize_in: [1, 5, {start : 0.1, end: 0.25}],
				messageC_fontsize_in: [1, 5, {start : 0.25, end: 0.4}],
				messageD_fontsize_in: [1, 5, {start : 0.4, end: 0.55}],
				messageE_fontsize_in: [1, 5, {start : 0.55, end: 0.7}],

				messageA_translateY_out: [0, -130, { start: 0.15, end: 0.5 }],
				messageB_translateY_out: [0, -120, { start: 0.3, end: 0.6 }],
				messageC_translateY_out: [0, -110, { start: 0.45, end: 0.7 }],
				messageD_translateY_out: [0, -100, { start: 0.6, end: 0.8 }],
				messageE_translateY_out: [0, -90, { start: 0.8, end: 0.95 }],
				messageA_fontsize_out: [5, 1, {start : 0.15, end: 0.5}],
				messageB_fontsize_out: [5, 1, {start : 0.3, end: 0.6}],
				messageC_fontsize_out: [5, 1, {start : 0.45, end: 0.7}],
				messageD_fontsize_out: [5, 1, {start : 0.6, end: 0.8}],
				messageE_fontsize_out: [5, 1, {start : 0.8, end: 0.95}],
				messageA_opacity_out: [1, 0, { start: 0.15, end: 0.5 }],
				messageB_opacity_out: [1, 0, { start: 0.3, end: 0.6 }],
				messageC_opacity_out: [1, 0, { start: 0.45, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.6, end: 0.8 }],
				messageE_opacity_out: [1, 0, { start: 0.8, end: 0.95 }],
			}
		},
		{
			// 8
			type: 'sticky',
			heightNum: 3,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-8'),
				canvasCaption: document.querySelector('.canvasjh-caption'),
				canvas: document.querySelector('.video-blend-canvas'),
				// context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/video.mp4'
				],
				images: []
			},
			values: {
				rect1X: [ 0, 0, { start: 0, end: 0 } ],
				rect2X: [ 0, 0, { start: 0, end: 0 } ],
				blendHeight: [ 0, 0, { start: 0, end: 0 } ],
				canvas_scale: [ 0, 0, { start: 0, end: 0 } ],
				canvasCaption_opacity: [ 0, 1, { start: 0, end: 0 } ],
				canvasCaption_translateY: [ 20, 0, { start: 0, end: 0 } ],
				rectStartY: 0
			}
			
		},
		{
			// 9
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-9'),
				messageA: document.querySelector('#scroll-section-9 .a'),
				messageB: document.querySelector('#scroll-section-9 .b'),
				messageC: document.querySelector('#scroll-section-9 .c'),
				canvas1: document.querySelector('#image-canvas-1'),
				canvas2: document.querySelector('#image-canvas-2'),
				canvas3: document.querySelector('#image-canvas-3'),
				context1: document.querySelector('#image-canvas-1').getContext('2d'),
				context2: document.querySelector('#image-canvas-2').getContext('2d'),
				context3: document.querySelector('#image-canvas-3').getContext('2d'),
				imagesPath: [
					'./images/love.jpg',
					'./images/friend.jpg',
					'./images/groub.jpg',
				],
				images: []
			},
			values: {
				canvas1_opacity_in: [0, 1, { start: 0.07, end: 0.35 }],
				canvas1_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				canvas1_translateY_in: [5, 0, { start: 0.07, end: 0.35 }],
				canvas1_translateY_out: [0, -5, { start: 0.4, end: 0.45 }],
				canvas2_opacity_in: [0, 1, { start: 0.45, end: 0.6 }],
				canvas2_opacity_out: [1, 0, { start: 0.6, end: 0.65 }],
				canvas2_translateY_in: [5, 0, { start: 0.45, end: 0.6 }],
				canvas2_translateY_out: [0, -5, { start: 0.6, end: 0.65 }],
				canvas3_opacity_in: [0, 1, { start: 0.65, end: 0.8 }],
				canvas3_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				canvas3_translateY_in: [5, 0, { start: 0.65, end: 0.8 }],
				canvas3_translateY_out: [0, -5, { start: 0.8, end: 0.9 }],

				messageA_translateY_in: [20, 0, { start: 0.2, end: 0.35 }],
				messageB_translateY_in: [30, 0, { start: 0.45, end: 0.6 }],
				messageC_translateY_in: [30, 0, { start: 0.65, end: 0.8 }],
				messageA_opacity_in: [0, 1, { start: 0.2, end: 0.35 }],
				messageB_opacity_in: [0, 1, { start: 0.45, end: 0.6 }],
				messageC_opacity_in: [0, 1, { start: 0.65, end: 0.8 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.6, end: 0.65 }],
				messageC_translateY_out: [0, -20, { start: 0.8, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.6, end: 0.65 }],
				messageC_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				canvas1_scale_in: [-0.05, 0, { start: 0.2, end: 0.35 }],
				canvas2_scale_in: [-0.05, 0, { start: 0.45, end: 0.6 }],
				canvas3_scale_in: [-0.05, 0, { start: 0.65, end: 0.8 }],
			}
		},
		{
			// 10
			type: 'sticky',
			heightNum: 6,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-10'),
				messageA: document.querySelector('#scroll-section-10 .a'),
				messageB: document.querySelector('#scroll-section-10 .b'),
				messageC: document.querySelector('#scroll-section-10 .c'),
				messageD: document.querySelector('#scroll-section-10 .d'),
				canvas4: document.querySelector('#image-canvas-4'),
				context4: document.querySelector('#image-canvas-4').getContext('2d'),
				canvas5: document.querySelector('#image-canvas-5'),
				context5: document.querySelector('#image-canvas-5').getContext('2d'),
				canvas6: document.querySelector('#image-canvas-6'),
				context6: document.querySelector('#image-canvas-6').getContext('2d'),
				imagesPath: [
					'./images/smile1.svg',
					'./images/smile2.svg',
					'./images/smile3.svg'
				],
				images: []
			},
			values: {

				canvas4_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				canvas4_opacity_out: [1, 0, { start: 0.25, end: 0.35 }],

				canvas5_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				canvas5_opacity_out: [1, 0, { start: 0.45, end: 0.55 }],

				canvas6_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				canvas6_opacity_out: [1, 0, { start: 0.65, end: 0.75 }],

				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [30, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [30, 0, { start: 0.7, end: 0.8 }],

				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.55 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.75 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 1}],

				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.55 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.75 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 1 }],

			}
		},
		{
			// 11
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-11'),
				mainMsg:document.querySelector('#scroll-section-11 .mid-message'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('#scroll-section-11 .image-blend-canvas'),
				msgA:document.querySelector('#scroll-section-11 .main-message.a'),
				msgB:document.querySelector('#scroll-section-11 .main-message.b'),
				msgC:document.querySelector('#scroll-section-11 .main-message.c'),
				msgD:document.querySelector('#scroll-section-11 .main-message.d'),
				context: document.querySelector('#scroll-section-11 .image-blend-canvas').getContext('2d'),
				imagesPath: 6,
				images: []
			},
			values: {
				rgbColor : [222,60,{start:0,end:0.1}],
				phoneAni: [ 0, 0, { start: 0, end: 0 } ],
				blendHeight: [ 0, 0, { start: 0, end: 0 } ],
				canvas_scale: [ 0, 0, { start: 0, end: 0 } ],
				canvasCaption_opacity: [ 0, 1, { start: 0, end: 0 } ],
				canvasCaption_translateY: [ 20, 0, { start: 0, end: 0 } ],
				msgA_opacity_in : [0,1,{start:0,end:0}],
				msgA_opacity_out : [1,0,{start:0,end:0}],
				msgB_opacity_in : [0,1,{start:0,end:0}],
				msgB_opacity_out : [1,0,{start:0,end:0}],
				msgC_opacity_in : [0,1,{start:0,end:0}],
				msgC_opacity_out : [1,0,{start:0,end:0}],
				msgD_opacity_in : [0,1,{start:0,end:0}],
				msgD_opacity_out : [1,0,{start:0,end:0}],
				msgA_trans_in : [20,0,{start:0,end:0}],
				msgA_trans_out : [0,-20,{start:0,end:0}],
				msgB_trans_in : [20,0,{start:0,end:0}],
				msgB_trans_out : [0,-20,{start:0,end:0}],
				msgC_trans_in : [20,0,{start:0,end:0}],
				msgC_trans_out : [0,-20,{start:0,end:0}],
				msgD_trans_in : [20,0,{start:0,end:0}],
				msgD_trans_out : [0,-20,{start:0,end:0}],
				rectStartY: 0
			}
		},
		{
			// 12
			type: 'sticky',
			heightNum: 6, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-12'),
				messageA: document.querySelector('#scroll-section-12 .main-message.a'),
				messageB: document.querySelector('#scroll-section-12 .main-message.b'),
				messageC: document.querySelector('#scroll-section-12 .main-message.c'),
				messageD: document.querySelector('#scroll-section-12 .main-message.d'),
				canvas: document.querySelector('#video-canvas-12'),
				context: document.querySelector('#video-canvas-12').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 500,
				imageSequence: [0, 499],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{
			// 13
			type: 'sticky',
			heightNum: 4, // 브라우저 높이의 4배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-13'),
				messageA: document.querySelector('#scroll-section-13 .main-message.a'),
				messageB: document.querySelector('#scroll-section-13 .main-message.b'),
				pencilLogo: document.querySelector('#scroll-section-13 .semi-logo'),
				ribbonPath: document.querySelector('.ribbon-path path')
			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.4 }],
				messageB_opacity_out: [1, 0, { start: 0.6, end: 0.7 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.4 }],
				pencilLogo_width_in: [2000, 200, { start: 0.1, end: 0.4 }],
				pencilLogo_width_out: [200, 50, { start: 0.4, end: 0.8 }],
				pencilLogo_translateX_in: [-10, 0, { start: 0.2, end: 0.4 }],
				pencilLogo_translateX_out: [0, 50, { start: 0.4, end: 0.8 }],
				pencilLogo_translateX_out2: [50, 100, { start: 0.8, end: 0.9 }],
				pencilLogo_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				path_dashoffset_in: [1401, 0, { start: 0.2, end: 0.4 }],
				path_dashoffset_out: [0, -1401, { start: 0.6, end: 0.8 }]
			}
		},
		{
			// 14
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-14'),
				messageMain: document.querySelector('#scroll-section-14 .a'),
				char1: document.querySelector('#scroll-section-14 .char-1'),
				char2: document.querySelector('#scroll-section-14 .char-2'),
				char3: document.querySelector('#scroll-section-14 .char-3'),
				char4: document.querySelector('#scroll-section-14 .char-4'),
				char5: document.querySelector('#scroll-section-14 .char-5'),
				char6: document.querySelector('#scroll-section-14 .char-6'),
				char7: document.querySelector('#scroll-section-14 .char-7')

			},
			values: {

				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageMain_opacity_in:[0,1,{start:0.1,end:0.2}],
				messageMain_opacity_out:[1,0,{start:0.6,end:0.7}],
				messageMain_tran_in:[20,0,{start:0.1,end:0.2}],
				messageMain_tran_out:[0,-20,{start:0.6,end:0.7}],
				char_uni_5:[200,250,{start:0.3,end:0.5}],
				char_uni_6:[250,300,{start:0.35,end:0.52}],
				char_uni_7:[300,350,{start:0.4,end:0.54}],
				char_uni_1:[1,50,{start:0.4,end:0.56}],
				char_uni_2:[50,100,{start:0.45,end:0.57}],
				char_uni_3:[100,150,{start:0.5,end:0.59}],
				char_uni_4:[150,200,{start:0.55,end:0.6}],
			}
		}
		
	];

	function setCanvasImages() {
		let imgElem2;
		for (let i = 0; i < sceneInfo[1].values.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/001/${0 + i}.JPEG`;
			sceneInfo[1].objs.videoImages.push(imgElem2);
			
		}

		let imgElem;
		for (let i = 0; i < sceneInfo[3].values.videoImageCount; i++) {
			imgElem = new Image();
			imgElem.src = `./video/002/${0 + i}.JPEG`;
			sceneInfo[3].objs.videoImages.push(imgElem);
		}
		
		let imgElem3;
		for (let i = 0; i < sceneInfo[2].objs.imagesPath.length; i++) {
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[2].objs.imagesPath[i];
			sceneInfo[2].objs.images.push(imgElem3);
		} 

		let imgElem5;
		for (let i = 0; i < sceneInfo[5].values.videoImageCount; i++) {
			imgElem5 = new Image();
			imgElem5.src = `./video/003/${0 + i}.jpeg`;
			sceneInfo[5].objs.videoImages.push(imgElem5);
		}

		let imgElem7;
		for (let i = 0; i < sceneInfo[7].values.videoImageCount; i++) {
			imgElem7 = new Image();
			imgElem7.src = `./video/004/${0 + i}.JPEG`;
			sceneInfo[7].objs.videoImages.push(imgElem7);
		}
		let imgElem9;
		for (let i = 0; i < sceneInfo[9].objs.imagesPath.length; i++) {
			imgElem9 = new Image();
			imgElem9.src = sceneInfo[9].objs.imagesPath[i];
			sceneInfo[9].objs.images.push(imgElem9);
		}
		let imgElem10;
		for (let i = 0; i < sceneInfo[10].objs.imagesPath.length; i++) {
			imgElem10 = new Image();
			imgElem10.src = sceneInfo[10].objs.imagesPath[i];
			sceneInfo[10].objs.images.push(imgElem10);
		}
		let imgElem11;
		for (let i = 0; i < sceneInfo[11].objs.imagesPath; i++) {
			imgElem11 = new Image();
			imgElem11.src = `./images/msg${i}.png`;
			sceneInfo[11].objs.images.push(imgElem11);
		}
		let imgElem12;
		for (let i = 0; i < sceneInfo[12].values.videoImageCount; i++) {
			imgElem12 = new Image();
			imgElem12.src = `./video/005/${0 + i}.JPEG`;
			sceneInfo[12].objs.videoImages.push(imgElem12);
		}

		let imgElem13;
		for (let i = 0; i < sceneInfo[13].values.videoImageCount; i++) {
			imgElem13 = new Image();
			imgElem13.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[13].objs.videoImages.push(imgElem13);
		}




	}

	function checkMenu() {
		if (yOffset > 44) {
			document.body.classList.add('local-nav-sticky');
		} else {
			document.body.classList.remove('local-nav-sticky');
		}
	}

	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
			
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
			
		}

		yOffset = window.pageYOffset;

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);

		let heightRatio = window.innerHeight / 1080;
		sceneInfo[1].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[3].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[5].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[7].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		sceneInfo[12].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		

		// 동훈
		sceneInfo[9].objs.context1.drawImage(sceneInfo[9].objs.images[0],0, 0);
		sceneInfo[9].objs.context2.drawImage(sceneInfo[9].objs.images[1],0, 0);
		sceneInfo[9].objs.context3.drawImage(sceneInfo[9].objs.images[2],0, 0);
		
		
		const heightRatio3 = window.innerHeight / sceneInfo[10].objs.canvas4.height;
		let canvasScaleRatio3;

		   canvasScaleRatio3 = heightRatio3;

		sceneInfo[10].objs.canvas4.style.transform = `translate3d(-50%,-50%,0)`;
         sceneInfo[10].objs.context4.drawImage(sceneInfo[10].objs.images[0],
            0, 0, sceneInfo[10].objs.images[0].naturalWidth, sceneInfo[10].objs.images[0].naturalHeight,
            sceneInfo[10].objs.canvas4.width*0.35, sceneInfo[10].objs.canvas4.height*0.4, 
            (sceneInfo[10].objs.images[0].naturalWidth*canvasScaleRatio3)*0.6, (sceneInfo[10].objs.images[0].naturalHeight*canvasScaleRatio3)*0.6);
          
            sceneInfo[10].objs.canvas5.style.transform = `translate3d(-50%,-50%,0)`;
         sceneInfo[10].objs.context5.drawImage(sceneInfo[10].objs.images[1],
            0, 0, sceneInfo[10].objs.images[0].naturalWidth, sceneInfo[10].objs.images[0].naturalHeight,
               sceneInfo[10].objs.canvas5.width*0.35, sceneInfo[10].objs.canvas5.height*0.4, 
               (sceneInfo[10].objs.images[0].naturalWidth*canvasScaleRatio3)*0.6, (sceneInfo[10].objs.images[0].naturalHeight*canvasScaleRatio3)*0.6);
               
               sceneInfo[10].objs.canvas6.style.transform = `translate3d(-50%,-50%,0)`;
         sceneInfo[10].objs.context6.drawImage(sceneInfo[10].objs.images[2],
                  0, 0, sceneInfo[10].objs.images[0].naturalWidth, sceneInfo[10].objs.images[0].naturalHeight,
                  sceneInfo[10].objs.canvas6.width*0.35, sceneInfo[10].objs.canvas6.height*0.4, 
                  (sceneInfo[10].objs.images[0].naturalWidth*canvasScaleRatio3)*0.6, (sceneInfo[10].objs.images[0].naturalHeight*canvasScaleRatio3)*0.6);
                  
	}

	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
		let photo = step;
		if (photo !== 0) photo = step - 1;

		switch (currentScene) {
			case 0:
				if (scrollRatio <= 0.4){
					objs.headmessage.style.fontSize = `${calcValues(values.headmessage_fontsize_out, currentYOffset)}rem`;
					objs.headmessage.style.opacity = calcValues(values.headmessage_opacity_out, currentYOffset);
				}
				break;

				
			case 1:
				if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.67) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					
				}

				if (scrollRatio <= 0.93) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					
				}
				break;
			case 2:
				
				let val1 = "";
				let val2 = "";
				let val3 = "";
				// 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}
				objs.canvas.style.transform = `scale(${canvasScaleRatio * 0.5})`;
				objs.context.drawImage(objs.images[photo], 0, 0);




				// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;

				if (!values.rectStartY) {
					// values.rectStartY = objs.canvas.getBoundingClientRect().top;
					values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
					values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}

				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;


				if (scrollRatio < values.rect1X[2].end) {
					// console.log('캔버스 닿기 전');
					objs.canvas.classList.remove('sticky');
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);

				} else {
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);

					values.blendHeight[0] = 0;
					values.blendHeight[1] = objs.canvas.height;
					values.blendHeight[2].start = values.rect1X[2].end;
					values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
					const blendHeight = calcValues(values.blendHeight, currentYOffset);

					values.blendHeight1[0] = 0;
					values.blendHeight1[1] = objs.canvas.height;
					values.blendHeight1[2].start = values.blendHeight[2].end;
					values.blendHeight1[2].end = values.blendHeight1[2].start + 0.2;
					const blendHeight1 = calcValues(values.blendHeight1, currentYOffset);

					values.blendHeight2[0] = 0;
					values.blendHeight2[1] = objs.canvas.height;
					values.blendHeight2[2].start = values.blendHeight1[2].end;
					values.blendHeight2[2].end = values.blendHeight2[2].start + 0.2;
					const blendHeight2 = calcValues(values.blendHeight2, currentYOffset);



					objs.canvas.classList.add('sticky');
					objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

					if (scrollRatio >= values.blendHeight[2].end) {
						values.canvas_scale[0] = canvasScaleRatio;
						values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
						values.canvas_scale[2].start = values.blendHeight[2].end;
						values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;
						objs.canvas.style.marginTop = 0;
					}


					if (scrollRatio >= values.blendHeight[2].start) {
						step = 1;
						val1 = objs.canvas.height - blendHeight;
						val2 = objs.canvas.width;
						val3 = blendHeight;

					}

					if (scrollRatio >= values.blendHeight1[2].start) {
						step = 2;
						val1 = objs.canvas.height - blendHeight1;
						val2 = objs.canvas.width;
						val3 = blendHeight1;

					}

					if (scrollRatio >= values.blendHeight2[2].start) {
						step = 3;
						val1 = objs.canvas.height - blendHeight2;
						val2 = objs.canvas.width;
						val3 = blendHeight2;
					}
					if (blendHeight == 1080) {
						photo = 0;
						photo = photo + 1;
						objs.context.drawImage(objs.images[photo], 0, 0);
					}
					if (blendHeight1 == 1080) {
						photo = photo + 1;
						objs.context.drawImage(objs.images[photo], 0, 0);
					}


					objs.context.drawImage(objs.images[step],
						0, val1, val2, val3,
						0, val1, val2, val3);


					if (blendHeight < 1080) {
						// in
						objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					} else {
						// out
						objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					}
					if (blendHeight1 < 1080) {
						// in
						objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					} else {
						// out
						objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					}

					if (blendHeight2 < 1080) {
						// in
						objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					} else {
						// out
						objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
						objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);


					}
					if (scrollRatio >= values.blendHeight2[2].end
						&& values.blendHeight2[2].end > 0) {
						objs.canvas.classList.remove('sticky');

						objs.canvas.style.marginTop = `${scrollHeight * 0.6}px`;

					}
				}

				break;
			case 3:
				if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
				}
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.72) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				break;
			case 4:
				//objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				if (scrollRatio <= 0.12) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.32) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.52) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.67) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
					objs.messageD.style.fontSize = `${calcValues(values.messageD_fontsize_up, currentYOffset)}rem`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				break;
			case 5:
				// console.log('0 play');
				// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				
				objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);

				if (scrollRatio <= 0.22) {
					// in

					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				break;

			case 7:
				// console.log('2 play');
				// let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

				if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.15) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.messageA.style.fontSize = `${calcValues(values.messageA_fontsize_in, currentYOffset)}rem`;

				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
					objs.messageA.style.fontSize = `${calcValues(values.messageA_fontsize_out, currentYOffset)}rem`;

					
				}
				if (scrollRatio <= 0.3) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.fontSize = `${calcValues(values.messageB_fontsize_in, currentYOffset)}rem`;

				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.fontSize = `${calcValues(values.messageB_fontsize_out, currentYOffset)}rem`;

				}

				if (scrollRatio <= 0.45) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.fontSize = `${calcValues(values.messageC_fontsize_in, currentYOffset)}rem`;

				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.fontSize = `${calcValues(values.messageC_fontsize_out, currentYOffset)}rem`;

				}
				if (scrollRatio <= 0.6) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
					objs.messageD.style.fontSize = `${calcValues(values.messageD_fontsize_in, currentYOffset)}rem`;

				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
					objs.messageD.style.fontSize = `${calcValues(values.messageD_fontsize_out, currentYOffset)}rem`;
				
				}
				if (scrollRatio <= 0.75) {
					// in
					objs.messageE.style.opacity = calcValues(values.messageE_opacity_in, currentYOffset);
					objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translateY_in, currentYOffset)}%, 0)`;
					objs.messageE.style.fontSize = `${calcValues(values.messageE_fontsize_in, currentYOffset)}rem`;

				} else {
					// out
					objs.messageE.style.opacity = calcValues(values.messageE_opacity_out, currentYOffset);
					objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translateY_out, currentYOffset)}%, 0)`;
					objs.messageE.style.fontSize = `${calcValues(values.messageE_fontsize_out, currentYOffset)}rem`;

				}

				break;

			case 8:
				sceneInfo[9].objs.container.style.background = "black";
				break;
			case 9:

				objs.container.style.background = "black";
				const kwidthRatio = window.innerWidth / objs.canvas1.width;
				const kheightRatio = window.innerHeight / objs.canvas1.height;
				let kcanvasScaleRatio;

				if (kwidthRatio <= kheightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					kcanvasScaleRatio = kheightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					kcanvasScaleRatio = kwidthRatio;
				}
				objs.messageA.style.color = 'white';
				if (scrollRatio <= 0.35) {
					// in

					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.canvas1.style.opacity = calcValues(values.canvas1_opacity_in, currentYOffset);
					objs.canvas1.style.transform = `translate3d(-50%, ${calcValues(values.canvas1_translateY_in, currentYOffset)-55}%, 0) 
					scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas1_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
					objs.canvas1.style.opacity = calcValues(values.canvas1_opacity_out, currentYOffset);
					objs.canvas1.style.transform = `translate3d(-50%, ${calcValues(values.canvas1_translateY_out, currentYOffset)-55}%, 0) scale(${kcanvasScaleRatio*0.5})`;
				}

				if (scrollRatio <= 0.6) {
					// in
					objs.messageB.style.color = 'white';
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.canvas2.style.opacity = calcValues(values.canvas2_opacity_in, currentYOffset);
					objs.canvas2.style.transform = `translate3d(-39%, ${calcValues(values.canvas2_translateY_in, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas2_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.canvas2.style.opacity = calcValues(values.canvas2_opacity_out, currentYOffset);
					objs.canvas2.style.transform = `translate3d(-39%, ${calcValues(values.canvas2_translateY_out, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5})`;
				}

				if (scrollRatio <= 0.8) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.canvas3.style.opacity = calcValues(values.canvas3_opacity_in, currentYOffset);
					objs.canvas3.style.transform = `translate3d(-46%, ${calcValues(values.canvas3_translateY_in, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5 + calcValues(values.canvas3_scale_in, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.canvas3.style.opacity = calcValues(values.canvas3_opacity_out, currentYOffset);
					objs.canvas3.style.transform = `translate3d(-46%, ${calcValues(values.canvas3_translateY_out, currentYOffset)-50}%, 0) scale(${kcanvasScaleRatio*0.5})`;
					
					sceneInfo[10].objs.container.style.background = "black";
				}

				

				break;

			case 10:
				// 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				const dhwidthRatio = window.innerWidth / objs.canvas4.width;
				const dhheightRatio = window.innerHeight / objs.canvas4.height;
				let dhcanvasScaleRatio;

				if (dhwidthRatio <= dhheightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					dhcanvasScaleRatio = dhheightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					dhcanvasScaleRatio = dhwidthRatio;
				}
				sceneInfo[10].objs.container.style.background = "black";
				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.canvas4.style.opacity = calcValues(values.canvas4_opacity_in, currentYOffset);

				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
					objs.canvas4.style.opacity = calcValues(values.canvas4_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.canvas5.style.opacity = calcValues(values.canvas5_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.canvas5.style.opacity = calcValues(values.canvas5_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.canvas6.style.opacity = calcValues(values.canvas6_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.canvas6.style.opacity = calcValues(values.canvas6_opacity_out, currentYOffset);
					
				}
				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);

				} else {
					// out
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);

					
				}
				
				sceneInfo[11].objs.container.style.background = 'black';
				break;

			case 11:

				const heightRatio4 = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio4;

				canvasScaleRatio4 = heightRatio4;

				
				objs.canvas.style.transform = `scale(${canvasScaleRatio4})`;
				
				if(scrollRatio <= 0.1){
					let rgbColor = parseInt(calcValues(values.rgbColor,currentYOffset));
					objs.mainMsg.style.color = `rgb(${rgbColor}, ${rgbColor}, ${rgbColor})`;
				}
				
				objs.container.style.background = 'black';

				if(!values.rectStartY){
					values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio4)/2;
					values.phoneAni[2].start = (values.rectStartY / scrollHeight);
					values.phoneAni[2].end = values.phoneAni[2].start + 0.5;

					values.canvasCaption_opacity[2].start = values.phoneAni[2].end;
					values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start+0.1;
					values.canvasCaption_translateY[2].start = values.phoneAni[2].end;
					values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start+0.1;

					values.msgA_opacity_in[2].start = values.phoneAni[2].start;
					values.msgA_opacity_in[2].end = values.phoneAni[2].start +0.05;
					values.msgA_trans_in[2].start = values.phoneAni[2].start; 
					values.msgA_trans_in[2].end = values.phoneAni[2].start+0.05; 
					values.msgA_opacity_out[2].start = values.msgA_opacity_in[2].end;
					values.msgA_trans_out[2].start = values.msgA_opacity_in[2].end;
					values.msgA_opacity_out[2].end = values.msgA_trans_out[2].start+0.05;
					values.msgA_trans_out[2].end = values.msgA_trans_out[2].start+0.05;

					values.msgB_opacity_in[2].start = values.msgA_trans_out[2].end ;
					values.msgB_opacity_in[2].end = values.msgA_trans_out[2].end  +0.05;
					values.msgB_trans_in[2].start = values.msgA_trans_out[2].end; 
					values.msgB_trans_in[2].end = values.msgA_trans_out[2].end+0.05; 
					values.msgB_opacity_out[2].start = values.msgB_trans_in[2].end;
					values.msgB_trans_out[2].start = values.msgB_trans_in[2].end;
					values.msgB_opacity_out[2].end = values.msgB_trans_in[2].end+0.05;
					values.msgB_trans_out[2].end = values.msgB_trans_in[2].end+0.05;

					values.msgC_opacity_in[2].start = values.msgB_trans_out[2].end;
					values.msgC_opacity_in[2].end = values.msgB_trans_out[2].end +0.05;
					values.msgC_trans_in[2].start = values.msgB_trans_out[2].end; 
					values.msgC_trans_in[2].end = values.msgB_trans_out[2].end+0.05; 
					values.msgC_opacity_out[2].start = values.msgC_trans_in[2].end;
					values.msgC_trans_out[2].start = values.msgC_trans_in[2].end;
					values.msgC_opacity_out[2].end = values.msgC_trans_in[2].end+0.05;
					values.msgC_trans_out[2].end = values.msgC_trans_in[2].end+0.05;

					values.msgD_opacity_in[2].start = values.msgC_trans_out[2].end;
					values.msgD_opacity_in[2].end = values.msgC_trans_out[2].end +0.05;
					values.msgD_trans_in[2].start = values.msgC_trans_out[2].end; 
					values.msgD_trans_in[2].end = values.msgC_trans_out[2].end+0.05; 
					values.msgD_opacity_out[2].start = values.msgD_trans_in[2].end;
					values.msgD_trans_out[2].start = values.msgD_trans_in[2].end;
					values.msgD_opacity_out[2].end = values.msgD_trans_in[2].end+0.05;
					values.msgD_trans_out[2].end = values.msgD_trans_in[2].end+0.05;
				}

				if(scrollRatio <= values.phoneAni[2].start){
					objs.canvas.classList.remove('sticky');
				}else{
					objs.canvas.classList.add('sticky');
					objs.canvas.style.marginTop = 0;
					objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio4)/2}px`;
					
					if(scrollRatio >= values.phoneAni[2].end && values.phoneAni[2].end>0){
						objs.canvas.classList.remove('sticky');
						objs.canvas.style.marginTop = `${scrollHeight * 0.5}px`;
					}
					
				}

				if(scrollRatio >= values.canvasCaption_translateY[2].start && values.canvasCaption_translateY[2].start > 0){
					objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
					objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
					
				}else{
					objs.canvasCaption.style.opacity = 0;
				}

				objs.msgA.style.color = 'white';
				objs.msgB.style.color = 'white';
				objs.msgC.style.color = 'white';
				objs.msgD.style.color = 'white';

				if(scrollRatio <= values.msgA_opacity_in[2].end){
					objs.msgA.style.opacity = calcValues(values.msgA_opacity_in,currentYOffset);
					objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_trans_in, currentYOffset)}%, 0)`;
				}else{
					objs.msgA.style.opacity = calcValues(values.msgA_opacity_out,currentYOffset);
					objs.msgA.style.transform = `translate3d(0, ${calcValues(values.msgA_trans_out, currentYOffset)}%, 0)`;
				}	

				if(scrollRatio <= values.msgB_opacity_in[2].end){
					objs.msgB.style.opacity = calcValues(values.msgB_opacity_in,currentYOffset);
					objs.msgB.style.transform = `translate3d(0, ${calcValues(values.msgB_trans_in, currentYOffset)}%, 0)`;
				}else{
					objs.msgB.style.opacity = calcValues(values.msgB_opacity_out,currentYOffset);
					objs.msgB.style.transform = `translate3d(0, ${calcValues(values.msgB_trans_out, currentYOffset)}%, 0)`;
				}	

				if(scrollRatio <= values.msgC_opacity_in[2].end){
					objs.msgC.style.opacity = calcValues(values.msgC_opacity_in,currentYOffset);
					objs.msgC.style.transform = `translate3d(0, ${calcValues(values.msgC_trans_in, currentYOffset)}%, 0)`;
				}else{
					objs.msgC.style.opacity = calcValues(values.msgC_opacity_out,currentYOffset);
					objs.msgC.style.transform = `translate3d(0, ${calcValues(values.msgC_trans_out, currentYOffset)}%, 0)`;
				}	

				if(scrollRatio <= values.msgD_opacity_in[2].end){
					objs.msgD.style.opacity = calcValues(values.msgD_opacity_in,currentYOffset);
					objs.msgD.style.transform = `translate3d(0, ${calcValues(values.msgD_trans_in, currentYOffset)}%, 0)`;
				}else{
					objs.msgD.style.opacity = calcValues(values.msgD_opacity_out,currentYOffset);
					objs.msgD.style.transform = `translate3d(0, ${calcValues(values.msgD_trans_out, currentYOffset)}%, 0)`;
				}	

				if(scrollRatio > values.msgA_opacity_in[2].start && scrollRatio <= values.msgA_opacity_out[2].end){
					objs.context.drawImage(objs.images[1],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}else if(scrollRatio > values.msgB_opacity_in[2].start && scrollRatio <= values.msgB_opacity_out[2].end){
					objs.context.drawImage(objs.images[2],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}else if(scrollRatio > values.msgC_opacity_in[2].start && scrollRatio <= values.msgC_opacity_out[2].end){
					objs.context.drawImage(objs.images[3],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}else if(scrollRatio > values.msgD_opacity_in[2].start && scrollRatio <= values.msgD_opacity_out[2].end){
					objs.context.drawImage(objs.images[4],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}else if(scrollRatio < values.msgA_opacity_in[2].start){
					objs.context.drawImage(objs.images[0],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}else if(scrollRatio > values.msgD_opacity_in[2].end){
					objs.context.drawImage(objs.images[5],
						0, 0, objs.images[0].naturalWidth, objs.images[0].naturalHeight,
						objs.canvas.width*0.55, (objs.canvas.height - (objs.images[0].naturalHeight*canvasScaleRatio4))/2, 
						objs.images[0].naturalWidth*canvasScaleRatio4, objs.images[0].naturalHeight*canvasScaleRatio4);
				}
				sceneInfo[12].objs.container.style.background = 'black';
				break;
			case 12:
				// console.log('0 play');
				// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				sceneInfo[12].objs.container.style.background = 'black';
				objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
					sceneInfo[13].objs.container.style.background ='black';
				}
				document.body.style.background = "black";
				break;
			
			case 13:
				if (scrollRatio <= 0.25) {
					// in
					objs.container.style.background ='black';
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.container.style.background ='white';
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.55) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
				}

				// 크기가 커져도 깨지지 않는 SVG의 장점을 살리기 위해 transform scale 대신 width를 조정
				if (scrollRatio <= 0.4) {
					objs.pencilLogo.style.width = `${calcValues(values.pencilLogo_width_in, currentYOffset)}vw`;
					objs.pencilLogo.style.transform = `translate(${calcValues(values.pencilLogo_translateX_in, currentYOffset)}%, -50%)`;
				} else {
					objs.pencilLogo.style.width = `${calcValues(values.pencilLogo_width_out, currentYOffset)}vw`;
					objs.pencilLogo.style.transform = `translate(${calcValues(values.pencilLogo_translateX_out, currentYOffset)}%, -50%)`;
				}

				if(scrollRatio >= 0.8){
					objs.pencilLogo.style.transform = `translate(50%,-${calcValues(values.pencilLogo_translateX_out2, currentYOffset)}%)`;
				}

				// 빨간 리본 패스(줄 긋기)
				if (scrollRatio <= 0.5) {
					objs.ribbonPath.style.strokeDashoffset = calcValues(values.path_dashoffset_in, currentYOffset);
				} else {
					objs.ribbonPath.style.strokeDashoffset = calcValues(values.path_dashoffset_out, currentYOffset);
				}

				objs.pencilLogo.style.opacity = calcValues(values.pencilLogo_opacity_out, currentYOffset);
				document.body.style.background = "white";

				break;
			case 14:
				document.body.style.background = "white";
				if(scrollRatio <= 0.2){
					objs.messageMain.style.opacity = calcValues(values.messageMain_opacity_in, currentYOffset);
					objs.messageMain.style.transform = `translate3d(0, ${calcValues(values.messageMain_tran_in, currentYOffset)}%,0)`;
					objs.char1.innerHTML='지';
					objs.char2.innerHTML='켜';
					objs.char3.innerHTML='줄';
					objs.char4.innerHTML='게';
					objs.char5.innerHTML='우';
					objs.char6.innerHTML='리';
					objs.char7.innerHTML='가';
					
				}else{
					objs.messageMain.style.opacity = calcValues(values.messageMain_opacity_out, currentYOffset);
					objs.messageMain.style.transform = `translate3d(0, ${calcValues(values.messageMain_tran_out, currentYOffset)}%,0)`;
					if((parseInt(scrollRatio)%2)===0){
					if(scrollRatio <= 0.3){
						objs.char5.innerHTML='우';
					}else{
						objs.char5.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_5, currentYOffset)));
						if(scrollRatio >= 0.5){objs.char5.innerHTML='우';}
					}
					if(scrollRatio <= 0.35){
						objs.char6.innerHTML='리';
					}else{
						objs.char6.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_6, currentYOffset)));
						if(scrollRatio >= 0.52){objs.char6.innerHTML='리';}
					}
					if(scrollRatio <= 0.4){
						objs.char7.innerHTML='가';
					}else{
						objs.char7.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_7, currentYOffset)));
						if(scrollRatio >= 0.54){objs.char7.innerHTML='가';}
					}
					if(scrollRatio <= 0.4){
						objs.char1.innerHTML='지';
					}else{
						objs.char1.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_1, currentYOffset)));
						if(scrollRatio >= 0.56){objs.char1.innerHTML='지';}
					}
					if(scrollRatio <= 0.45){
						objs.char2.innerHTML='켜';
					}else{
						objs.char2.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_2, currentYOffset)));
						if(scrollRatio >= 0.57){objs.char2.innerHTML='켜';}
					}
					if(scrollRatio <= 0.5){
						objs.char3.innerHTML='줄';
					}else{
						objs.char3.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_3, currentYOffset)));
						if(scrollRatio >= 0.59){objs.char3.innerHTML='줄';}
					}
					if(scrollRatio <= 0.55){
						objs.char4.innerHTML='게';
					}else{
						objs.char4.innerHTML=String.fromCharCode(parseInt(calcValues(values.char_uni_4, currentYOffset)));
						if(scrollRatio >= 0.6){
							objs.char4.innerHTML='게';
						}
					}
				}
				break;
			}		
		}	
		
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (enterNewScene) return;

		playAnimation();
	}

	function loop() {
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

		if (!enterNewScene) {
			if (currentScene === 1 || currentScene === 3 || currentScene === 5 || currentScene === 7 || currentScene === 12) {
				const currentYOffset = delayedYOffset - prevScrollHeight;
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;
				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				if (objs.videoImages[sequence]) {
					objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				}
			}
		}

        // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
            sceneInfo[5].objs.canvas.style.opacity = 1;
			sceneInfo[5].objs.context.drawImage(sceneInfo[5].objs.videoImages[0], 0, 0);
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
            let tempYOffset = yOffset;
            scrollTo(0, tempYOffset - 1);
        }

		rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
	}

	window.addEventListener('load', () => {
		setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
        document.body.classList.remove('before-load');
        setLayout();

		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
  			checkMenu();

  			if (!rafState) {
  				rafId = requestAnimationFrame(loop);
  				rafState = true;
  			}
  		});

  		window.addEventListener('resize', () => {
  			if (window.innerWidth > 900) {
				window.location.reload();
			}
  		});

  		window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});

  		document.querySelector('.loading').addEventListener('transitionend', (e) => {
  			document.body.removeChild(e.currentTarget);
  		});

	});

	setCanvasImages();

})();
