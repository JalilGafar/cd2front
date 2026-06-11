/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `serch_result_procedure` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER $$
CREATE PROCEDURE `serch_result_procedure`(
    IN `ville`   VARCHAR(45),
    IN `diplome` VARCHAR(45),
    IN `domaine` VARCHAR(45),
    IN `branche` VARCHAR(200)
)
BEGIN
	DECLARE diplome_filter TEXT;
    DECLARE domaine_filter TEXT;

    -- ── Construction du filtre domaine ───────────────────────────────────
    IF domaine IS NULL OR domaine = '' THEN
        SET domaine_filter = '1=1';

    ELSEIF domaine REGEXP '^[0-9]+$' THEN
        -- Angular envoie un id_dom numérique (string)
        -- Si c'est un parent → ramène le parent + tous ses enfants
        -- Si c'est un enfant → filtre ciblé sur ce seul sous-domaine
        SET domaine_filter = CONCAT(
            'id_dom IN (',
                'SELECT id_dom FROM domaines ',
                'WHERE id_dom = ', domaine, ' ',
                'OR parent_id = ', domaine,
            ')'
        );

    ELSE
        -- Fallback texte : comportement original pour tout appel legacy
        -- qui enverrait encore un nom_dom au lieu d'un id
        SET domaine_filter = CONCAT(
            "id_dom IN (",
                "SELECT id_dom FROM domaines ",
                "WHERE nom_dom LIKE '", REPLACE(domaine, "'", "''"), "' ",
                "OR parent_id = (",
                    "SELECT id_dom FROM domaines ",
                    "WHERE nom_dom LIKE '", REPLACE(domaine, "'", "''"), "' ",
                    "AND parent_id IS NULL LIMIT 1",
                ")",
            ")"
        );
    END IF;

    -- ── Recherche sans filtre diplôme ─────────────────────────────────────
    IF diplome = '' THEN
        SET @sql = CONCAT(
            "SELECT DISTINCT
                nom_dip, nom_cat, id_ecol, nom_e, groupe, sigle_e, ville_cam,
                id_form, date_debut_f, cout_f, logo_e, descriptif_dip, descriptif_f,
                tel_1_e, email_e, siteweb_e, conditions_f, descriptif_e,
                0 AS ordre_priorite
            FROM v_formations_search
            WHERE ville_cam LIKE '", REPLACE(ville, "'", "''"), "'
              AND ", domaine_filter, "
            ORDER BY ordre_priorite ASC"
        );

    ELSE
        -- ── Regroupement par famille de niveaux ───────────────────────────
        IF diplome IN ('Licence','Licence Pro','Bachelor','Ingénieur de Travaux','BUT','DGC') THEN
            SET diplome_filter = "'Licence','Licence Pro','Bachelor','Ingénieur de Travaux','BUT','DGC'";
        ELSEIF diplome IN ('Master','MBA','Master Pro','Ingénieur de conception') THEN
            SET diplome_filter = "'Master','MBA','Master Pro','Ingénieur de conception'";
        ELSEIF diplome IN ('BP','CAP','Vocational Diplomas','DTS','BQP','DT','DQP',
                           'Certification Internationale','Formation Qualifiante',
                           'Attestation de Formation','CQP') THEN
            SET diplome_filter = "'BP','CAP','Vocational Diplomas','DTS','BQP','DT','DQP',
                                   'Certification Internationale','Formation Qualifiante',
                                   'Attestation de Formation','CQP'";
        ELSEIF diplome IN ('BTS','DUT','Prépa International','HND','DSEP') THEN
            SET diplome_filter = "'BTS','DUT','Prépa International','HND','DSEP'";
        ELSE
            SET diplome_filter = CONCAT("'", REPLACE(diplome, "'", "''"), "'");
        END IF;

        SET @sql = CONCAT(
            "SELECT DISTINCT
                nom_dip, nom_cat, id_ecol, nom_e, groupe, sigle_e, ville_cam,
                id_form, date_debut_f, cout_f, logo_e, descriptif_dip, descriptif_f,
                tel_1_e, email_e, siteweb_e, conditions_f, descriptif_e,
                CASE WHEN nom_cat = '", REPLACE(diplome, "'", "''"), "' THEN 0 ELSE 1 END AS ordre_priorite
            FROM v_formations_search
            WHERE ville_cam LIKE '", REPLACE(ville, "'", "''"), "'
              AND nom_cat IN (", diplome_filter, ")
              AND ", domaine_filter, "
            ORDER BY ordre_priorite ASC"
        );
    END IF;

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END $$
DELIMITER ;