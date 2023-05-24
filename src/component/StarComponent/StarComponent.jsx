import { BsStarFill, BsStar  } from "react-icons/bs";
const StarComponent = ({star}) => {
    const stars = [];
    for (let i = 0; i < star; i++) {
        stars.push(
          <BsStarFill color="#e6f82f"/>
        );
    }

    for (let i = 0; i < 5 - star; i++) {
        stars.push(
          <BsStar/>
        );
    }
    return (<div className="flex items-center">
        {stars}
    </div>)

}

export default StarComponent;