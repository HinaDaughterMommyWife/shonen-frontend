interface WavyTextProps {
  text: string;
}

const WavyText: React.FC<WavyTextProps> = ({ text }) => {
  return <div className="wobble-text">{text}</div>;
};

export default WavyText;
