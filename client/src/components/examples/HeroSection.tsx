import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  const handleGetStarted = () => {
    console.log('Get started clicked');
  };

  const handleWatchDemo = () => {
    console.log('Watch demo clicked');
  };

  return (
    <HeroSection 
      onGetStarted={handleGetStarted}
      onWatchDemo={handleWatchDemo}
    />
  );
}