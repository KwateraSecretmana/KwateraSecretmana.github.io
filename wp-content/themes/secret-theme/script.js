let scrolling = false
let scrollingIntervalFunction = false
const sendPingFlag = true

backgroundElement = document.querySelector('.bg')
teaseLinkElements = document.querySelectorAll('.tease-link')
postHeaderTitleElement = document.querySelector('.post-header-title')
postImageElements = document.querySelectorAll('.article-body img[srcset]')
videoElements = document.querySelectorAll('video')
iframeElements = document.querySelectorAll('iframe')
infoElement = document.querySelector('.info')
themeInputs = document.querySelectorAll('input[name="color-scheme"]');

class AboutMe extends HTMLElement {
    constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: "closed" })
        shadowRoot.innerHTML = `
            <style>
                .tease-info-avatar {
                    height: 100px;
                    float: left;
                    margin-bottom: 5px;
                    margin-right: 10px;
                    margin-top: 5px;
                    max-width: 100px;
                    border-radius: 50%;
                    width: 100px;
                }
            </style>
            <img class="tease-info-avatar" src="/wp-content/themes/secret-theme/assets/avatar.jpg?1" alt="Avatar Secretman" loading="lazy">
            Uszanowanko, tu <span style="display: inline-block">Secretman 🙂👋</span>.<br/> Witaj na stronie, gdzie dzielę się swoimi opiniami i wrażeniami z ostatnio zagranych gier. Strona powstała, ponieważ napisałem sporo komentarzy na temat gier w różnych zakamarkach Internetu i pewnego razu pomyślałem, że fajnie byłoby to zebrać w jednym miejscu. I oto, co z tego wyszło. Cieszę się, że tu jesteś i mam nadzieję, że znajdziesz coś, co Cię zainteresuje.`
    }
}

window.customElements.define("about-me", AboutMe);

if (sendPingFlag) {
  fetch('https://serwer2025.com.pl/ping/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `page=${window.location.pathname}`
  })
}

if (backgroundElement) {
  window.addEventListener('scroll', () => {
    if (!scrollingIntervalFunction) {
      scrollingIntervalFunction = setInterval(() => {
        const scrollPosition = window.scrollY
        const documentHeight = document.querySelector('body').scrollHeight
        let objectPosition = parseInt((scrollPosition / (documentHeight - window.innerHeight)) * 100)
        objectPosition = objectPosition > 100 ? 100 : objectPosition
        document.querySelector('.bg').style.objectPosition = '50% ' + objectPosition + '%'
        clearInterval(scrollingIntervalFunction)
        scrollingIntervalFunction = false
      }, 50)
    }
  })
}

if (themeInputs) {
	const getInitialTheme = () => {
		const saved = localStorage.getItem('user-theme');
		if (saved) return saved;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	const initialTheme = getInitialTheme();
	const targetInput = document.querySelector(`.toggle-input[value="${initialTheme}"]`);
	if (targetInput) targetInput.checked = true;

	themeInputs.forEach(input => {
		input.addEventListener('change', (e) => {
			localStorage.setItem('user-theme', e.target.value);
		});
	});
}

if (teaseLinkElements) {
  teaseLinkElements.forEach(teaseLink => {
    teaseLink.addEventListener('mouseenter', element => {
      const targetCanvas = teaseLink.querySelector('.tease-canvas');
      const ctx = targetCanvas.getContext('2d');
      const sourceImage = teaseLink.querySelector('.tease-image');
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

      const imgWidth = sourceImage.naturalWidth;
      const imgHeight = sourceImage.naturalHeight;
      const canvasWidth = targetCanvas.width;
      const canvasHeight = targetCanvas.height;

      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const newWidth = imgWidth * scale;
      const newHeight = imgHeight * scale;

      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.drawImage(sourceImage, x, y, newWidth, newHeight);
    });
  })
}

if (postHeaderTitleElement) {
  const toggleTitleBackgroundOnResize = () => {
    const postHeaderElement = document.querySelector('.post-header')
    const postHeaderBackgroundElement = document.querySelector('.post-header-background')
    const postHeaderComputedStyle = window.getComputedStyle(postHeaderElement)
    const postHeaderElementWidth = postHeaderElement.offsetWidth - parseFloat(postHeaderComputedStyle.paddingLeft) - parseFloat(postHeaderComputedStyle.paddingRight)
    const postHeaderTitleElement = document.querySelector('.post-header-title')
    const postHeaderImageElement = document.querySelector('.post-header-image')

    if (postHeaderElementWidth - postHeaderImageElement.offsetWidth < postHeaderTitleElement.offsetWidth) {
      const backgroundWidth = postHeaderTitleElement.offsetWidth - (postHeaderElementWidth - postHeaderImageElement.offsetWidth)
      postHeaderBackgroundElement.style.width = backgroundWidth + 'px'
      postHeaderBackgroundElement.classList.add('post-header-background__show')
    } else {
      postHeaderBackgroundElement.classList.remove('post-header-background__show')
    }
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    toggleTitleBackgroundOnResize()

    setTimeout(toggleTitleBackgroundOnResize, 1500)
  })

  window.addEventListener('resize', () => {
    if (typeof window.resizeWait != 'undefined') {
      clearTimeout(window.resizeWait)
    }
    window.resizeWait = setTimeout(() => {
      toggleTitleBackgroundOnResize()
    }, 10)
  })
}

if (postImageElements) {
  postImageElements.forEach(image => {
    const srcset = image.srcset.split(',')
    const lastUrl = srcset[srcset.length - 1].split(' ')[1]
    const parent = image.parentNode
    let wrapper = Object.assign(document.createElement('a'), {
      className: 'image-full-size',
      href: lastUrl,
      target: '_blank'
    })
    parent.replaceChild(wrapper, image)
    wrapper.appendChild(image)
  })
}

if (videoElements) {
  videoElements.forEach(video => {
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')

    // if (window.matchMedia("(min-width: 768px)").matches && !isFirefox) {
    //   video.setAttribute('autoplay', true)
    //   video.play()
    // }

    const parent = video.parentNode
    let wrapper = Object.assign(document.createElement('div'), {
      className: 'video',
      innerHTML: `
        <button class="video-button-sound" data-src="${video.src}" aria-label="Dźwięk"></button>
        <button class="video-button-play" data-src="${video.src}" aria-label="Odtwarzaj"></button>`
    })
    parent.replaceChild(wrapper, video)
    wrapper.appendChild(video)
    video.style.visibility = 'visible'

    video.addEventListener('play', video => {
      let button = document.querySelector(`.video-button-play[data-src="${video.target.src}"]`)
      button.classList.add('video-button-play__on')
    })
  })

  document.querySelectorAll('.video-button-sound').forEach(button => {
    button.addEventListener('click', button => {
      button.target.classList.toggle('video-button-sound__on')
      let video = document.querySelector(`video[src="${button.target.dataset.src}"]`)
      video.muted = !video.muted
    })
  })

  document.querySelectorAll('video').forEach(videoElement => {
    videoElement.addEventListener('click', video => {
      if (video.target.paused == true) {
        video.target.play()
      } else {
        video.target.pause()
      }
      let button = document.querySelector(`.video-button-play[data-src="${video.target.src}"]`)
      button.classList.toggle('video-button-play__on')
    })
  })
}

if (iframeElements) {
  function getYouTubeId(url) {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  iframeElements.forEach(iframe => {
    const parent = iframe.parentNode
    let wrapper = Object.assign(document.createElement('div'), {
      className: 'iframe',
    })
    parent.replaceChild(wrapper, iframe)

    if (iframe.dataset.src) {
      if (typeof YT === 'undefined') {
        let youtubeApiScript = document.createElement('script')
        youtubeApiScript.type = 'text/javascript'
        youtubeApiScript.src = '//www.youtube.com/iframe_api'
        youtubeApiScript.defer = true
        document.head.appendChild(youtubeApiScript)
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting === true) {
          const youTubeId = getYouTubeId(iframe.dataset.src)
          let ext, vi_ext, quality = 'sd'
          if (iframe.dataset.jpg) {
            vi_ext = ''
            ext = 'jpg'
          } else {
            vi_ext = '_webp'
            ext = 'webp'
          }
          quality = iframe.dataset.quality ?? quality

          wrapper.style.backgroundImage = `url(//i.ytimg.com/vi${vi_ext}/${youTubeId}/${quality}default.${ext})`

          wrapper.addEventListener('click', button => {
            iframe.src = iframe.dataset.src
            wrapper.appendChild(iframe)
            let counter = 0
            const playVideoAfterLoadIframe = setInterval(() => {
              if (iframe.id || counter == 3) {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
                clearInterval(playVideoAfterLoadIframe)
              }
              counter++
            }, 500)
          }, { once: true })

          observer.unobserve(entries[0].target)
        }
      }, {threshold: 0})
      observer.observe(wrapper)
    } else {
      wrapper.appendChild(iframe)
    }
  })
}

if (infoElement) {
  setTimeout(() => {
    const cookieObj = new URLSearchParams(document.cookie.replaceAll("&", "%26").replaceAll("; ", "&"))
    if (cookieObj.get("accept") != 1) {
      infoElement.classList.add('info__show')
    }
  }, 5000)

  document.querySelector('.info-button').addEventListener('click', button => {
    infoElement.classList.remove('info__show')

    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = "accept=1;" + expires + "; path=/";
  })
}