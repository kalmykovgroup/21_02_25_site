import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store.ts";

// ✅ Создаём `useAppDispatch`, который знает тип `AppDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;

// ✅ Создаём `useAppSelector`, который знает тип `RootState`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
