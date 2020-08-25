import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgendaEventCategory } from '../data/dbSchema';

export type SelectedCategorySlice = AgendaEventCategory | null;

const activeCategory = createSlice({
  name: 'activeCategory',
  initialState: 'home' as AgendaEventCategory,
  reducers: {
    selectCategory(
      _state,
      action: PayloadAction<AgendaEventCategory>,
    ): SelectedCategorySlice {
      return action.payload;
    },
  },
});

const { reducer } = activeCategory;

export { reducer as activeCategoryReducer };
export const { selectCategory } = activeCategory.actions;
