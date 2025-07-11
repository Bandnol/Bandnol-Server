import { trackInfoResponseDTO } from "../dtos/recoms.dto.js";
import { RecomsSongNotFoundError } from "../errors.js";
import { getRecomsSong } from "../repositories/recoms.repository.js";

export const recomsSong = async (recomsId) => {
    const recomsData = await getRecomsSong(recomsId);

    if (recomsData === null) {
        throw new RecomsSongNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    console.log(recomsData);
    return trackInfoResponseDTO(recomsData);
};
