import styles from './Blackout.module.css';
import {Component} from "react";
import PropTypes from "prop-types";

let zIndex = 100;

class Blackout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            background : props.background,
            setCancelingBlackoutZIndex : props.setCancelingBlackoutZIndex,
            callBack : props.callBack,
            zIndex : zIndex + 1,
            isOpen : false
        }
        props.setRef(() => this);
        zIndex += 2;
    }

    //Событие когда нужно отобразить затемнение
    //Событие когда нужно убрать затемнение
    //CallBack функция, которую мы вызываем, когда пользователь нажал на область затемнения
    //Компонент, который мы должны оставить не затемненным
    //Указать силу и цвет затемнения


    on() {
        this.state.setCancelingBlackoutZIndex(this.state.zIndex + 1);
        this.setState({
            isOpen : true
        })

    }

    off(){
        this.state.setCancelingBlackoutZIndex(undefined);
        if(this.state.callBack !== undefined) this.state.callBack();
        this.setState({
            isOpen : false
        })
    }

    render() {

        return(  <div style={
                {
                    display: this.state.isOpen ? "block" : "none",
                    background: this.state.background,
                    zIndex: `${this.state.zIndex}`
                }
            } className={styles.blackout}
                 onClick={() => this.off()}></div>
        );

    }
}

Blackout.propTypes = {
    setRef: PropTypes.func,
    background: PropTypes.string,
    setCancelingBlackoutZIndex: PropTypes.func,
    callBack: PropTypes.func,
};

export default Blackout;