import { useNavigation } from "react-router-dom";

const SubmitBtn = ({formBtn}) => {
    //checking the state of form submition
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    return (
        <button 
            type="submit" 
            className={`btn btn-block ${formBtn && 'form-btn'}`}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'submitting' : 'submit'}
        </button>
    )
}
export default SubmitBtn