const localvideo = document.querySelector('video#localvideo'),
  remotevideo = document.querySelector('video#remotevideo'),
  btnStart = document.querySelector('button#start'),
  btnCall = document.querySelector('button#call'),
  btnHangup = document.querySelector('button#hangup'),
  offer = document.querySelector('textarea#offer'),
  answer = document.querySelector('textarea#answer')

let localStream, pc1, pc2;

function getMediaStream(stream) {
  localvideo.srcObject = stream
  localStream = stream
}

function handleError(error) {
  console.error(error);
}

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('the getUsermedia is not support!');
    return
  }

  const constraints = {
    video: true,
    audio: false
  }
  navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch(handleError)
}

function getRemoteStream(e) {
  remotevideo.srcObject = e.streams[0]
}

function handleAnswerError(err) {
  console.error('failed to create answer:', err);
}

function getAnswer(desc) {
  pc2.setLocalDescription(desc);

  answer.value = desc.sdp

  // send desc to signal
  // receive desc from signal
  pc1.setRemoteDescription(desc)
}
function getOffer(desc) {
  pc1.setLocalDescription(desc)

  offer.value = desc.sdp

  // send desc to signal
  // receive desc from signal

  pc2.setRemoteDescription(desc)
  pc2.createAnswer().then(getAnswer).catch(handleAnswerError)
}

function handleOfferError(err) {
  console.error('failed to create offer:', err);
}
function call() {
  pc1 = new RTCPeerConnection()
  pc2 = new RTCPeerConnection()

  pc1.onicecandidate = (e) => {
    pc2.addIceCandidate(e.candidate)
  }

  pc2.onicecandidate = (e) => {
    pc1.addIceCandidate(e.candidate)
  }

  pc2.ontrack = getRemoteStream;

  // 先添加媒体流，然后再做媒体协商
  localStream.getTracks().forEach(track => {
    pc1.addTrack(track, localStream)
  })


  const offerOptions = {
    offerToRecieveAudio: 0,
    offerTorecieveVideo: 1
  }
  pc1.createOffer(offerOptions).then(getOffer).catch(handleOfferError)

}

function hangup() {
  pc1.close();
  pc2.close();

  pc1 = null
  pc2 = null
}

btnStart.onclick = start
btnCall.onclick = call
btnHangup.onclick = hangup
