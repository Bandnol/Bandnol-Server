export const searchTracksResponseDTO = (tracks) => {
    return {
       data: tracks,
       pagination: {
         cursor: tracks.length ? tracks[tracks.length-1].id: null,
       }
    }
}