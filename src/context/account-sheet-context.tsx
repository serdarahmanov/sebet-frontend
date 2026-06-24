import { createContext, useContext } from "react";

type AccountSheetContextType = {
  openSheet: () => void;
};

const AccountSheetContext = createContext<AccountSheetContextType>({
  openSheet: () => {},
});

export const useAccountSheet = () => useContext(AccountSheetContext);
export default AccountSheetContext;
