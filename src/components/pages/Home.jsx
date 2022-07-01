import savings from '../../img/savings.svg'
import styles from './Home.module.css'
import LinkButton from '../layout/LinkButton';
export default function Home(){
    return (
        <section className={styles.home_container}>
        <h1>Bem-vindo ao <span>costs</span></h1>
        <p>Comece a gerenciar os seus projectos agora mesmo!</p>
        <LinkButton to="/newProject" text="Criar Projecto"/>
        <img src={savings} alt="Costs"/>
        </section>
    );
}