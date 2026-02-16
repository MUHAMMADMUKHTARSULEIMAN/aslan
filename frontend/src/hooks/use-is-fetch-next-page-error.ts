import { useEffect, useState } from "react";

const useIsFetchNextPageError = (isFetchNextPageError: boolean): boolean => {
		const [booly, setBooly] = useState(false);
	
		useEffect(() => {
			setBooly(isFetchNextPageError);
		}, [isFetchNextPageError]);

		return booly
}

export default useIsFetchNextPageError