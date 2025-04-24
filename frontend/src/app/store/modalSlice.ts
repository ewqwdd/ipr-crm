import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  modalData: unknown | null;
  prev?: ModalState;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalData: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state: ModalState,
      action: PayloadAction<{
        type: string;
        data?: unknown;
      }>,
    ) => {
      if (state.isOpen) {
        state.prev = {
          isOpen: state.isOpen,
          modalType: state.modalType,
          modalData: state.modalData,
          prev: state.prev,
        };
      }
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      if (state.prev) {
        state.isOpen = state.prev.isOpen;
        state.modalType = state.prev.modalType;
        state.modalData = state.prev.modalData;
        state.prev = state.prev.prev;
        return;
      }
      state.isOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
    setModalData: (state: ModalState, action: PayloadAction<unknown>) => {
      state.modalData = action.payload;
    },
    closeFullModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
  },
});

export const { openModal, closeModal, setModalData } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
export const modalActions = modalSlice.actions;
