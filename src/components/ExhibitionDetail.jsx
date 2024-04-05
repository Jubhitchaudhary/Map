import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ACCESS_TOKEN = "5c3b94adb6f0b03bcd71109dc2f422e6"

const ExhibitionDetail = () => {
    const params = useParams();
    const [fullDetails, setFullDetails] = useState(null);

    useEffect(() => {
        const getExhibitionDetail = async () => {
            try {
                const details = await fetch(`https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getInfo&access_token=${ACCESS_TOKEN}&exhibition_id=${params.id}`);
                if (!details.ok) {
                    throw new Error('Failed to fetch exhibition details');
                }
                const detailsJson = await details.json();
                setFullDetails(detailsJson.exhibition);
            } catch (error) {
                console.error('Error fetching exhibition details: ', error);
            }
        };
        getExhibitionDetail();
    }, [params.id]);

    if (!fullDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>{fullDetails.title}</h1>
            <p>{fullDetails.text}</p>
            <p>Date Start: {fullDetails.date_start}</p>
            <p>Date End: {fullDetails.date_end}</p>
            {/* <Link to={`/exhibitions/${params.id}/details`}>View More Details</Link> */}
        </div>
    );
};

export default ExhibitionDetail;
