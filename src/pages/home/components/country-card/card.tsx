import { FormEvent, useReducer, MouseEvent } from "react";
import styles from "./card.module.css";
import { Link } from "react-router-dom";
import CountryName from "@/pages/home/components/country-card/country-name/countryName";
import CountryFlag from "@/pages/home/components/country-card/country-flag/country-flag";
import Vote from "@/pages/home/components/country-card/vote";
import Sorting from "@/pages/home/components/country-card/sorting";
import CountryCreateForm from "@/pages/home/components/country-card/country-create-form/country-create-from";
import { CountriesList } from "@/pages/home/components/country-card/reducer/state";
import { countriesReducer } from "@/pages/home/components/country-card/reducer/reducer";

const Card: React.FC = () => {
  const [countriesList, dispatch] = useReducer(countriesReducer, CountriesList);

  const handleCountryUpvote = (id: string) => () => {
    dispatch({ type: "upvote", payload: { id } });
  };

  const handleCountriesSortByLikes = (sortType: "asc" | "desc") => {
    dispatch({ type: "sort", payload: { sortType } });
  };

  const handleCreateCountry = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const countryObj: any = {};
    const formData = new FormData(e.currentTarget);

    for (const [key, value] of formData) {
      countryObj[key] = value;
    }

    dispatch({ type: "create", payload: { countryObj } });
  };

  const handleCountryDelete = (e: MouseEvent, id: string) => {
    e.preventDefault();
    dispatch({ type: "delete", payload: { id } });
  };

  const handleUndoDelete = (country: any) => {
    dispatch({ type: "undo", payload: { country } });
  };

  return (
    <>
      <Sorting
        onSortAsc={() => handleCountriesSortByLikes("asc")}
        onSortDesc={() => handleCountriesSortByLikes("desc")}
      />
      <CountryCreateForm onCountryCreate={handleCreateCountry} />
      <div className={styles.countryCard}>
        {countriesList.map((country) => (
          <div
            key={country.id}
            className={
              country.isDeleted ? styles.deleted : styles.countryDetails
            }
          >
            <CountryName name={country.name} />
            <Vote
              onUpVote={handleCountryUpvote(country.id)}
              voteCount={country.vote}
            />
            <CountryFlag flag={country.flag} />
            {!country.isDeleted && (
              <Link className={styles.links} to={`/home/${country.id}`}>
                <span>More Info</span>
                <span
                  className={styles.delete}
                  onClick={(e) => handleCountryDelete(e, country.id)}
                >
                  Delete
                </span>
              </Link>
            )}
            {country.isDeleted && (
              <button
                className={styles.undoButton}
                onClick={() => handleUndoDelete(country)}
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Card;
