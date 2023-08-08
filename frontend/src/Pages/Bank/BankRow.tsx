import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BankModel } from './Models';
import { updateBankDetails, deleteBank } from './banksData'; // Assuming you have updateBankDetails and deleteBank functions
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface Props {
  bank: BankModel;
}

export default function BankRow({ bank }: Props) {
  const queryClient = useQueryClient();

  const { id, DisplayName, BankName, BankAddress, AccountNumber, IFSCode, SWIFTCode, Branch, gstID, OpeningBalance, companyId } = bank;

  const [localDisplayName, setLocalDisplayName] = useState(DisplayName);

  const { isLoading: isDeleting, mutate: deleteMutate } = useMutation({
    mutationFn: (id: number) => deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries('banks'); // Invalidate query for delete
      toast.success('Bank deleted successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const newData = { id, DisplayName: localDisplayName, BankName, BankAddress, AccountNumber, IFSCode, SWIFTCode, Branch, gstID, OpeningBalance, companyId }
  
  const { mutate: updateDisplayNameMutate } = useMutation({
    mutationFn: (newDisplayName: string) => updateBankDetails(id, newData),
    onSuccess: () => {
      toast.success('Display Name updated successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = event.target.value;
    setLocalDisplayName(newDisplayName);
    const newData = { id, DisplayName: localDisplayName, BankName, BankAddress, AccountNumber, IFSCode, SWIFTCode, Branch, gstID, OpeningBalance, companyId }
    // Call the mutation immediately when input changes
    updateDisplayNameMutate(newData);
  };

  return (
    <tr key={id}>
      <td>
        <input
          name="Display Name"
          value={localDisplayName}
          onChange={handleDisplayNameChange}
        />
      </td>
      <td>{BankName}</td>
      <td>{BankAddress} </td>
      <td>{AccountNumber}</td>
      <td>
        <button onClick={() => deleteMutate(id)} disabled={isDeleting}>
          Delete
        </button>
      </td>
    </tr>
  );
}
