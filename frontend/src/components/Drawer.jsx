import { useSelector } from 'react-redux';
import LoginSuccessNotification from './Logins';
import UserInfo from './UserInfo';
import Guidelines from './Guidelines';
import ImageUploadComponent from './ImageUpload';
import ImageUploadSuccess from './ImageUploadSuccess';

const DrawerOverlay = () => {
  const { isOpen, step } = useSelector((state) => state.ui.drawer);

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1: return <LoginSuccessNotification/>;
      case 2: return <UserInfo/>
      case 3: return <Guidelines />;
      case 4: return <ImageUploadComponent />;
      case 5: return <ImageUploadSuccess />;
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
