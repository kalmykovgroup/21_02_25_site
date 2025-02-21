import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "../../../store/store.ts";
import {setFocus, setQuery, addToHistory, removeFromHistory} from "../../../store/header/searchSlice.ts";
import styles from "./SearchBar.module.css";
import React from "react";

interface SearchBarProps {
    className?: string
}

const SearchBar : React.FC<SearchBarProps> = ({className}: SearchBarProps) =>  {
    const dispatch = useDispatch<AppDispatch>();
    const {isFocused, query, searchHistory} = useSelector((state: RootState) => state.searchSlice);

    const handleSubmit = () => {
        if (query.trim()) {
            dispatch(addToHistory(query));
            dispatch(setQuery("")); // Очищаем поле после отправки
        }
    };

    const handleRemoveHistory = (item: string) => {
        dispatch(removeFromHistory(item));
    };

    const highlightMatch = (text: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} className={styles.highlight}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div className={`${styles.searchWrapper} ${className}`}>
            {/* Затемнение экрана */}
            {isFocused && <div className={styles.overlay} onClick={() => dispatch(setFocus(false))}/>}

            {/* Поле поиска с кнопкой */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Поиск..."
                    value={query}
                    onFocus={() => dispatch(setFocus(true))}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                />
                <button className={styles.clearSearch} onClick={() => dispatch(setQuery(""))}>
                    <svg className={styles.clearSearchIcon} width="24" height="24" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L20 20M20 4L4 20" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                <button className={styles.searchButton} onClick={handleSubmit}>
                    Найти
                </button>
            </div>

            {/* История поиска */}
            {isFocused && searchHistory.length > 0 && (
                <ul className={styles.historyList}>
                    {searchHistory
                        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                        .map((item, index) => (
                            <li key={index} className={styles.historyItem}>
                                <div>
                                    {highlightMatch(item)}
                                </div>
                                <button className={styles.removeButton} onClick={() => handleRemoveHistory(item)}>
                                    <svg className={styles.removeIcon} width="20" height="20" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4L20 20M20 4L4 20" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
