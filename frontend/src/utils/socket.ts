import { io } from 'socket.io-client';

const signalingSocket = io('http://localhost:3000'); // Connect to the signaling server
const peerConnection = new RTCPeerConnection();

// Listen for ICE candidates and send them via Socket.IO
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        signalingSocket.emit('signal', {
            to: 12, // Specify the peer's ID
            signal: { candidate: event.candidate }
        });
    }
};

signalingSocket.on('signal', async (data) => {
  if (data.signal.sdp) {
      if (data.signal.type === 'offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          signalingSocket.emit('signal', { to: data.from, signal: { sdp: answer } });
      } else if (data.signal.type === 'answer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
      }
  } else if (data.signal.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
  }
});

const dataChannel = peerConnection.createDataChannel("chat");
dataChannel.onopen = () => console.log("Data channel is open!");
dataChannel.onmessage = (event) => console.log("Message from peer:", event.data);

async function initiateConnection(targetPeerId:number) {
  console.log('Initiating connection with peer', targetPeerId);
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  signalingSocket.emit('signal', { to: targetPeerId, signal: { sdp: offer } });
}

function sendSocketMessage(message:string) {
  if (dataChannel.readyState === "open") {
      dataChannel.send(message);
  }
}

export { initiateConnection, sendSocketMessage };
