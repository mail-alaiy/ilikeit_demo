import { useSelector } from 'react-redux';
import LoginSignupModal from './Login';
import AddNameScreen from './AddName';
import UploadPicturesScreen from './UploadPictures';
import ImageUploadSuccessDrawer from './SelectedImage';

const DrawerOverlay = () => {
  const { isOpen, step } = useSelector((state) => state.ui.drawer);

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1: return <LoginSignupModal />;
      case 2: return <AddNameScreen />;
      case 3: return <UploadPicturesScreen />;
      case 4: return <ImageUploadSuccessDrawer />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {renderStep()}
    </div>
  );
};

export default DrawerOverlay;
