import AudioPlayer from '../Player/index2';

const PlayerPage = ({ songs }) => {
  return (
    <div>
      <AudioPlayer songs={songs} />
    </div>
  );
};

export default PlayerPage;
