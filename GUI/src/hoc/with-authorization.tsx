import React from 'react';
import useStore from 'store/store';

export enum ROLES {
  ROLE_ADMINISTRATOR = 'ROLE_ADMINISTRATOR',
  ROLE_SERVICE_MANAGER = 'ROLE_SERVICE_MANAGER',
  ROLE_CUSTOMER_SUPPORT_AGENT = 'ROLE_CUSTOMER_SUPPORT_AGENT',
  ROLE_CHATBOT_TRAINER = 'ROLE_CHATBOT_TRAINER',
  ROLE_ANALYST = 'ROLE_ANALYST',
  ROLE_UNAUTHENTICATED = 'ROLE_UNAUTHENTICATED',
}

function withAuthorization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: ROLES[] = [],
): React.FC<P> {
  const CheckRoles: React.FC<P> = ({ ...props }: P) => {
    
    const userInfo = useStore(x => x.userInfo);
    const allowed = allowedRoles?.some(x => userInfo?.authorities.includes(x));

    if(!userInfo) {
      return <span>Loading...</span>
    }
    
    if(!allowed) {
      return <span>Unauthorized Access</span>
    }

    return <WrappedComponent {...props as P} />;
  };
  
  return CheckRoles;
};

export default withAuthorization;
